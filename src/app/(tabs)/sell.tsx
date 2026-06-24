import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Button,
  Chip,
  HelperText,
  IconButton,
  SegmentedButtons,
  Text,
} from 'react-native-paper';

import { FormField } from '@/components/FormField';
import { StoreMap } from '@/components/StoreMap';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useFetch } from '@/hooks/useFetch';
import { Coordinate, useLocation } from '@/hooks/useLocation';
import { createAuction } from '@/services/auctions';
import { listCategories } from '@/services/categories';
import { ImageAsset, uploadListingImage } from '@/services/images';
import { createListing } from '@/services/listings';
import { Category, CreateListingRequest, ListingMode } from '@/types/api';
import { getErrorMessage } from '@/utils/errors';
import { isNonEmpty, isPositiveNumber } from '@/utils/validation';

const MAX_IMAGES = 5;

interface FieldErrors {
  title?: string;
  category?: string;
  condition?: string;
  price?: string;
}

export default function SellScreen() {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const location = useLocation(false);
  const { data: categories } = useFetch<Category[]>(
    (signal) => listCategories(signal),
    [],
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [mode, setMode] = useState<ListingMode>('FIXED');
  const [fixedPrice, setFixedPrice] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [durationDays, setDurationDays] = useState('7');
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (categoryId == null) next.category = 'Selecciona una categoría.';
    if (!isNonEmpty(condition)) next.condition = 'Indica la condición.';
    if (mode === 'FIXED' && !isPositiveNumber(fixedPrice)) {
      next.price = 'Ingresa un precio válido.';
    }
    if (mode === 'AUCTION' && !isPositiveNumber(startingPrice)) {
      next.price = 'Ingresa un precio inicial válido.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!validate() || categoryId == null) return;
    setSubmitting(true);
    try {
      const body: CreateListingRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        mode,
        condition: condition.trim(),
        categoryId,
        fixedPrice: mode === 'FIXED' ? Number(fixedPrice) : undefined,
      };
      const listing = await createListing(body);

      // For auctions, open the auction over the freshly created listing.
      if (mode === 'AUCTION') {
        const days = Number(durationDays) || 7;
        const endsAt = new Date(Date.now() + days * 86_400_000).toISOString();
        await createAuction({
          listingId: listing.id,
          startingPrice: Number(startingPrice),
          endsAt,
        });
      }

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
        label="Condición (ej: PSA 9 — Mint, Usado)"
        value={condition}
        onChangeText={setCondition}
        errorText={errors.condition}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Categoría
      </Text>
      <View style={styles.chips}>
        {(categories ?? []).map((cat) => (
          <Chip
            key={cat.id}
            selected={categoryId === cat.id}
            showSelectedCheck
            onPress={() => setCategoryId(cat.id)}
          >
            {cat.name}
          </Chip>
        ))}
      </View>
      {errors.category ? (
        <HelperText type="error" visible>
          {errors.category}
        </HelperText>
      ) : null}

      <Text variant="bodyMedium" style={styles.label}>
        Modalidad
      </Text>
      <SegmentedButtons
        value={mode}
        onValueChange={(v) => setMode(v as ListingMode)}
        buttons={[
          { value: 'FIXED', label: 'Venta', icon: 'tag' },
          { value: 'AUCTION', label: 'Subasta', icon: 'gavel' },
        ]}
      />

      {mode === 'FIXED' ? (
        <FormField
          label="Precio (S/)"
          keyboardType="decimal-pad"
          value={fixedPrice}
          onChangeText={setFixedPrice}
          errorText={errors.price}
        />
      ) : (
        <>
          <FormField
            label="Precio inicial (S/)"
            keyboardType="decimal-pad"
            value={startingPrice}
            onChangeText={setStartingPrice}
            errorText={errors.price}
          />
          <FormField
            label="Duración (días)"
            keyboardType="number-pad"
            value={durationDays}
            onChangeText={setDurationDays}
          />
        </>
      )}

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

      {/* Store location — GPS + Google Maps (preview; backend no persiste coords aún) */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Ubicación de tu tienda
      </Text>
      <Button
        mode="outlined"
        icon="crosshairs-gps"
        loading={location.loading}
        onPress={location.request}
      >
        Usar mi ubicación
      </Button>
      <HelperText type="info" visible>
        Toca el mapa o arrastra el marcador para previsualizar la ubicación.
      </HelperText>
      <StoreMap
        coordinate={coordinate ?? location.coordinate}
        editable
        onChange={setCoordinate}
        title={title || 'Mi tienda'}
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
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
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
