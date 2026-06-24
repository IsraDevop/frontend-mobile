import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Button,
  Card,
  HelperText,
  IconButton,
  SegmentedButtons,
  Text,
} from 'react-native-paper';

import { FormField } from '@/components/FormField';
import { StoreMap } from '@/components/StoreMap';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { Coordinate, useLocation } from '@/hooks/useLocation';
import { ImageAsset, uploadListingImage } from '@/services/images';
import { createListing } from '@/services/listings';
import {
  CreateListingRequest,
  ListingCondition,
  ListingMode,
} from '@/types/api';
import { getErrorMessage } from '@/utils/errors';
import { isNonEmpty, isPositiveNumber } from '@/utils/validation';

const MAX_IMAGES = 5;

interface FieldErrors {
  title?: string;
  price?: string;
}

export default function SellScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const location = useLocation(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [storeName, setStoreName] = useState('');
  const [mode, setMode] = useState<ListingMode>('DIRECT');
  const [condition, setCondition] = useState<ListingCondition>('NEW');
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.coordinate) setCoordinate(location.coordinate);
  }, [location.coordinate]);

  useEffect(() => {
    if (location.error) showError(location.error);
  }, [location.error, showError]);

  const addAsset = (asset: ImagePicker.ImagePickerAsset) => {
    setImages((prev) => [
      ...prev,
      {
        uri: asset.uri,
        name: asset.fileName ?? undefined,
        type: asset.mimeType ?? 'image/jpeg',
      },
    ]);
  };

  const pickFromCamera = async () => {
    if (images.length >= MAX_IMAGES) {
      showError(`Máximo ${MAX_IMAGES} imágenes por producto.`);
      return;
    }
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        showError('Permiso de cámara denegado. Actívalo en Configuración.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (!result.canceled) addAsset(result.assets[0]);
    } catch {
      showError('No se pudo abrir la cámara.');
    }
  };

  const pickFromGallery = async () => {
    if (images.length >= MAX_IMAGES) {
      showError(`Máximo ${MAX_IMAGES} imágenes por producto.`);
      return;
    }
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        showError('Permiso de galería denegado. Actívalo en Configuración.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
      if (!result.canceled) addAsset(result.assets[0]);
    } catch {
      showError('No se pudo abrir la galería.');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!isNonEmpty(title)) next.title = 'Ingresa un título.';
    if (!isPositiveNumber(price)) next.price = 'Ingresa un precio válido.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const body: CreateListingRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        mode,
        condition,
        storeName: storeName.trim() || undefined,
        latitude: coordinate?.latitude,
        longitude: coordinate?.longitude,
      };
      const listing = await createListing(body);

      // Upload images sequentially so the backend can order them.
      for (let i = 0; i < images.length; i += 1) {
        await uploadListingImage(listing.id, images[i], i);
      }

      showSuccess('¡Producto publicado!');
      router.replace(`/listing/${listing.id}`);
    } catch (e) {
      showError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.heading}>
        Publicar producto
      </Text>

      <FormField
        label="Título"
        value={title}
        onChangeText={setTitle}
        errorText={errors.title}
      />
      <FormField
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <FormField
        label="Precio (S/)"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
        errorText={errors.price}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Modalidad
      </Text>
      <SegmentedButtons
        value={mode}
        onValueChange={(v) => setMode(v as ListingMode)}
        buttons={[
          { value: 'DIRECT', label: 'Venta', icon: 'tag' },
          { value: 'AUCTION', label: 'Subasta', icon: 'gavel' },
        ]}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Condición
      </Text>
      <SegmentedButtons
        value={condition}
        onValueChange={(v) => setCondition(v as ListingCondition)}
        buttons={[
          { value: 'NEW', label: 'Nuevo' },
          { value: 'LIKE_NEW', label: 'Como nuevo' },
          { value: 'USED', label: 'Usado' },
        ]}
      />

      {/* Image picker — camera sensor + gallery */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Fotos ({images.length}/{MAX_IMAGES})
      </Text>
      <View style={styles.imageRow}>
        {images.map((img, index) => (
          <View key={img.uri} style={styles.thumbWrapper}>
            <Image source={{ uri: img.uri }} style={styles.thumb} />
            <IconButton
              icon="close-circle"
              size={20}
              style={styles.thumbRemove}
              onPress={() => removeImage(index)}
            />
          </View>
        ))}
      </View>
      <View style={styles.imageButtons}>
        <Button mode="outlined" icon="camera" onPress={pickFromCamera}>
          Tomar foto
        </Button>
        <Button mode="outlined" icon="image" onPress={pickFromGallery}>
          Galería
        </Button>
      </View>

      {/* Store location — GPS + Google Maps */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Ubicación de la tienda
      </Text>
      <FormField
        label="Nombre de la tienda"
        value={storeName}
        onChangeText={setStoreName}
      />
      <Button
        mode="outlined"
        icon="crosshairs-gps"
        loading={location.loading}
        onPress={location.request}
      >
        Usar mi ubicación
      </Button>
      <HelperText type="info" visible>
        Toca el mapa o arrastra el marcador para ajustar la ubicación.
      </HelperText>
      <StoreMap
        coordinate={coordinate}
        editable
        onChange={setCoordinate}
        title={storeName || 'Mi tienda'}
      />

      <Button
        mode="contained"
        icon="cloud-upload"
        onPress={submit}
        loading={submitting}
        disabled={submitting}
        style={styles.submit}
      >
        Publicar
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10 },
  heading: { fontWeight: '700', marginBottom: 4 },
  label: { opacity: 0.7, marginTop: 4 },
  sectionTitle: { marginTop: 12, fontWeight: '700' },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumbWrapper: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  thumbRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
    backgroundColor: '#fff',
  },
  imageButtons: { flexDirection: 'row', gap: 8 },
  submit: { marginTop: 16, marginBottom: 32 },
});
