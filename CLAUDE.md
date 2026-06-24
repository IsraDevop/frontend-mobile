# Resumen y Buenas Prácticas - Curso de Desarrollo Basado en Plataformas (Frontend)

Este documento contiene un resumen estructurado y las buenas prácticas extraídas de las presentaciones del curso CS2031 (Desarrollo Basado en Plataformas), abarcando desde las bases del cliente web hasta el desarrollo móvil con React Native.

El frontend tiene que ser responsive tanto web como mobile.

## 1. Resumen de Contenidos por Módulo

### Semana 9: Fundamentos del Cliente (Web)
* **Arquitectura Cliente-Servidor:** Interacción mediante peticiones HTTP/HTTPS (Request/Response) y consumo de APIs REST.
* **Tecnologías Base:** HTML (Estructura), CSS (Estilización), JavaScript (Lógica y manipulación del DOM) y TypeScript (Superconjunto tipado).
* **Herramientas:** Uso de TailwindCSS para estilización rápida y Axios para consumo de APIs basado en promesas.
* **Asincronía:** Manejo de promesas con `async/await` para evitar bloqueos en la interfaz al consumir servicios externos.

### Semana 10: Introducción a React I
* **Concepto:** Librería basada en componentes y programación declarativa que utiliza el Virtual DOM para renderizado eficiente.
* **JSX/TSX:** Extensión de sintaxis que combina HTML, CSS y lógica JS/TS en un solo archivo (componente).
* **Props:** Mecanismo para pasar datos (variables, funciones, componentes hijos) de un componente padre a un hijo.
* **Renderizado y Listas:** Uso de `map()` para renderizar listas y operadores lógicos (`&&`, `? :`) para renderizado condicional.
* **Eventos y Enrutamiento:** Manejo de eventos sintéticos (`onClick`, `onChange`, `onSubmit`) y uso de `react-router-dom` para la navegación web.

### Semana 11: Introducción a React II (Hooks)
* **Hooks Básicos:** * `useState`: Añade memoria (estado) a los componentes funcionales.
  * `useEffect`: Sincroniza el componente con sistemas externos (APIs, DOM, suscripciones) manejando efectos secundarios.
* **Patrones de Estado:** * *Lifting State Up* (Elevar el estado): Mover el estado al ancestro común más cercano cuando múltiples componentes necesitan compartirlo.
  * *Context API* (`useContext`): Solución al *prop drilling* para compartir datos globales en el árbol de componentes.
* **Custom Hooks:** Creación de funciones propias (que inician con `use`) para encapsular y reutilizar lógica de estado compleja.

### Semanas 12 y 13: React Native y Mobile
* **React Native:** Framework para desarrollo móvil multiplataforma (iOS y Android) renderizando componentes nativos reales usando React.
* **Expo:** Conjunto de herramientas (Expo Go, Expo Router) que agiliza el desarrollo móvil abstraendo la configuración nativa.
* **Navegación Móvil:** Uso de Expo Router (enrutamiento basado en archivos) y React Navigation (Stack, Drawer, Bottom Tabs).
* **Sensores y Seguridad:** Acceso a hardware móvil (cámara, GPS, biometría) mediante Expo SDK y almacenamiento protegido mediante `Expo SecureStore`.

---

## 2. Buenas Prácticas Extraídas (Best Practices)

### Arquitectura y Consumo de APIs
1. **Manejo de Errores Exhaustivo:** Siempre envolver las peticiones asíncronas (Axios/Fetch) en bloques `try/catch` para manejar fallos del servidor y evitar que la aplicación se rompa.
2. **Tipado Estricto con TypeScript:** Crear `interfaces` o `types` precisos para el cuerpo de las peticiones (Request Body) y las respuestas de las APIs para aprovechar el *static type checking*.
3. **Variables de Entorno:** Mantener URLs base (como `BACKEND_URL`) en constantes globales o variables de entorno para facilitar el paso entre desarrollo y producción.

### Componentes y JSX
4. **Nomenclatura Capitalizada:** Todo componente de React debe declararse con PascalCase (ej. `CourseList`, no `courseList`) para que React lo distinga de etiquetas HTML estándar.
5. **Retorno de un Solo Elemento:** Los componentes deben retornar un único elemento raíz. Utilizar React Fragments (`<> ... </>`) para agrupar múltiples elementos sin añadir nodos extra al DOM.
6. **Keys Únicas en Listas:** Siempre proveer la propiedad `key` al renderizar colecciones con `.map()`. Utilizar identificadores únicos (como `id` de base de datos) en lugar del índice del array para optimizar el renderizado y evitar bugs visuales.

### Manejo de Estado y Hooks
7. **Reglas de los Hooks:** * Llamarlos siempre en el nivel superior del componente.
   * Nunca usarlos dentro de bucles, condicionales o funciones anidadas.
8. **Inmutabilidad del Estado:** Nunca mutar variables de estado directamente. Usar siempre la función *setter* devuelta por `useState` (ej. `setCount(count + 1)`). Para actualizaciones basadas en el estado previo, usar funciones de actualización (ej. `setAge(a => a + 1)`).
9. **Elevar el Estado (Lifting State Up):** Cuando dos componentes hermanos necesiten sincronizar información, el estado debe moverse al componente padre común en lugar de intentar sincronizarlos entre sí.
10. **Evitar Prop Drilling:** Usar `Context API` cuando un estado global deba pasar por más de 3 niveles de profundidad en el árbol de componentes (ej. temas, sesión de usuario).
11. **Uso Correcto de useEffect:**
    * No usar `useEffect` para transformar datos que pueden calcularse directamente durante el renderizado.
    * Siempre definir correctamente el **array de dependencias**. Si está vacío `[]`, el efecto corre una sola vez al montar. Si no se pasa, corre en cada render. Si tiene variables `[a, b]`, corre cuando estas cambian.
12. **Custom Hooks para Lógica Repetitiva:** Si la misma lógica de `useState` y `useEffect` se usa en varios componentes (ej. hacer fetch a un endpoint, detectar conexión), abstraerla en un Custom Hook (`useFetch`, `useOnlineStatus`).

### Desarrollo Móvil (React Native)
13. **Almacenamiento Sensible:** Nunca guardar tokens de sesión, contraseñas o claves API en `AsyncStorage` ni en `LocalStorage`. Utilizar obligatoriamente **Expo SecureStore**, el cual aprovecha el cifrado nativo del hardware (Keychain en iOS, Keystore en Android).
14. **Navegación Basada en Archivos:** Para proyectos modernos en Expo, utilizar la estructura de carpetas de Expo Router (`_layout.tsx`, `index.tsx`, `[id].tsx`) para mantener una navegación organizada y predecible.
15. **Uso de Librerías Ul UI:** Priorizar el uso de librerías de componentes (como DaisyUI, shadcn/ui, Aceternity en web, o equivalentes en mobile) para acelerar el desarrollo y mantener consistencia de diseño en lugar de escribir todo el CSS/estilos desde cero.

### Ampliación Semanas 12 y 13: Ecosistema Mobile y Navegación
* **React Native y Expo:** React Native compila a componentes nativos (Kotlin/Swift) ofreciendo rendimiento multiplataforma [cite: 12]. Expo facilita el proceso proveyendo herramientas como Expo Go para visualizar cambios en tiempo real sin requerir configuraciones complejas de Android Studio o Xcode [cite: 12].
* **Componentes Core y UI:** Uso de componentes nativos (como `View`, `Text`, `FlatList`, `ScrollView`) en lugar de etiquetas HTML clásicas [cite: 12]. Implementación de patrones visuales usando **React Native Paper** (Material Design) [cite: 12].
* **React Navigation:** Gestión de rutas envolviendo la app en un componente `NavigationContainer` [cite: 13]. Soporta diferentes flujos:
  * *Native Stack Navigator:* Navegación en pila que permite regresar mediante historial [cite: 13].
  * *Drawer Navigator:* Menú deslizante lateral [cite: 13].
  * *Bottom & Top Tabs:* Navegación por pestañas inferiores y superiores [cite: 13].

### Semana 14: Hardware y Sensores con Expo
* **Expo Sensors:** Acceso a hardware como el Acelerómetro (orientación y movimiento en ejes x, y, z), Magnetómetro (brújula en microteslas) y Podómetro (conteo de pasos mediante Activity Recognition) [cite: 14].
* **Expo Multimedia y Localización:**
  * *ImagePicker:* Interfaz para acceder a la galería o tomar fotos [cite: 15].
  * *Camera Component:* Vista de cámara controlada con estados para manipular su comportamiento [cite: 15].
  * *Location:* Obtención asíncrona de coordenadas GPS actuales [cite: 15].
  * *Audio:* Reproducción y grabación de notas de voz [cite: 15].

---

## 3. Buenas Prácticas de Desarrollo Móvil (Ampliación)

16. **Gestión de Permisos Explícita:** Toda funcionalidad nativa (Cámara, GPS, Podómetro, Micrófono) requiere solicitar y validar permisos del usuario (ej. usando `requestForegroundPermissionsAsync()` o plugins en `app.json`). Siempre debes validar el estado de la promesa (si está en `granted`) antes de acceder al hardware para evitar que la app colapse [cite: 14, 15].
17. **Limpieza de Suscripciones (Cleanup):** Al trabajar con sensores activos como el acelerómetro o magnetómetro, siempre debes guardar la suscripción y llamar a `.remove()` en el `return` del `useEffect`. Esto evita llamadas fantasma y fugas de memoria cuando cambias de pantalla [cite: 14].
18. **Importaciones Condicionales:** Cuando utilices dependencias como el *Drawer Navigator*, asegúrate de hacer importaciones exclusivas para entornos nativos (ej. cargar `react-native-gesture-handler` solo en nativo y no en web) para mantener la estabilidad del código multiplataforma [cite: 13].
19. **Retroalimentación de Disponibilidad:** Al usar hardware específico, debes proveer estados para alertar al usuario si el hardware está cargando, funcionando correctamente o denegado (ej. mostrar *"Permission to access location was denied"*) [cite: 15].

---

## 4. Buenas Prácticas Adicionales (Extraídas de Revisión de Código)

### Sensores y Hardware

20. **Verificar Disponibilidad del Sensor Antes de Suscribirse:** Antes de llamar a `addListener()` en cualquier sensor (Acelerómetro, Magnetómetro, Podómetro), verificar con `Sensor.isAvailableAsync()` que el hardware existe en el dispositivo. Los emuladores y algunos dispositivos físicos pueden no tener el sensor. Mostrar un mensaje de UI si no está disponible, no solo un `console.log`.

```ts
const isAvailable = await Accelerometer.isAvailableAsync();
if (!isAvailable) {
  setErrorMessage("Sensor no disponible en este dispositivo");
  return;
}
setSubscription(Accelerometer.addListener(setData));
```

21. **Try/Catch en Operaciones de Hardware Asíncronas:** Las llamadas a `getCurrentPositionAsync()`, `Audio.Sound.createAsync()`, `Camera`, y similares pueden fallar por razones externas (GPS apagado, hardware ocupado, timeout). Siempre envolverlas en `try/catch` con estado de error visible para el usuario.

```ts
try {
  const location = await Location.getCurrentPositionAsync({});
  setLocation(location);
} catch (error) {
  setErrorMessage("No se pudo obtener la ubicación. Verifica que el GPS esté activo.");
}
```

22. **Error de Permiso Denegado en UI, No en Consola:** Cuando un permiso es denegado, actualizar un estado de error y mostrarlo en la interfaz. Usar `console.log` solo en desarrollo; el usuario nunca ve la consola.

```ts
// MAL: solo para desarrolladores
console.log("Permiso de reconocimiento de actividad no concedido");

// BIEN: visible para el usuario
setErrorMessage("Permiso denegado. Actívalo en Configuración > Aplicaciones.");
```

### Reutilización de Lógica con Custom Hooks

23. **Custom Hook para Sensores Reutilizables:** Cuando dos o más pantallas usan la misma lógica de suscripción/baja de un sensor (e.g., `Accelerometer` y `Magnetometer` comparten `addListener`, `remove`, `setUpdateInterval`), abstraer en un Custom Hook para eliminar duplicación y aplicar las reglas de limpieza en un solo lugar.

```ts
// hooks/useSensor.ts
function useSensor<T>(Sensor: SensorAPI<T>, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  function subscribe() { setSubscription(Sensor.addListener(setData)); }
  function unsubscribe() { subscription?.remove(); setSubscription(null); }

  useEffect(() => { subscribe(); return () => unsubscribe(); }, []);
  return { data, subscription, subscribe, unsubscribe };
}
```

### Tipado y Estructura

24. **Definir Interface para Datos de Sensores:** Declarar siempre una `interface` explícita para los datos que devuelve un sensor en lugar de tipos inline. Esto mejora la legibilidad y permite reutilizar el tipo en otros componentes o en el custom hook.

```ts
// MAL: tipo inline al desestructurar
const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

// BIEN: interface reutilizable
interface SensorCoordinate { x: number; y: number; z: number; }
const [coordinate, setCoordinate] = useState<SensorCoordinate>({ x: 0, y: 0, z: 0 });
```

### UI y Componentes

25. **Librería UI para Consistencia Visual:** En proyectos Expo, preferir **React Native Paper** (Material Design) sobre `StyleSheet` manual para componentes comunes (`Button`, `Card`, `Surface`, `TextInput`). Esto acelera el desarrollo y garantiza accesibilidad y consistencia entre pantallas.

```ts
import { Button, Card } from "react-native-paper";
// En lugar de TouchableOpacity con StyleSheet manual
```
### Consideraciones para hacer frontend mobile

Utiliza la metodología git flow, crea una rama por cada feature. Crea issues por cada nuevo requerimiento/feature y que este vinculado con la rama y los commits necesarios. No agregues ningun comentario en los commits ni en los PRs.
Utiliza github projects y los milestones. 
Sigue las indicaciones de @DOCS.md
El backend para este proyecto frontend se encuentra en C:\Users\ALVA\OneDrive\Documentos\Programación\PROYECTO\backend y se encuentra desplegado en https://yala.dpdns.org/api/v1/ 

El frontend web debe estar desplegado en AWS Amplify
Debe haber un workflow que se dispare cuando haya cambios en main y actualice el frontend mobile via Expo.

El link del repo de frontend web es el siguiente: https://github.com/Sebas-Leo/frontend_yala

Y este es el repo donde estamos trabajando frontend mobile: https://github.com/IsraDevop/frontend-mobile
