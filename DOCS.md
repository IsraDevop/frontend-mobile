# 📱 Rúbrica Mobile — CS 2031 DBP
> **Puntaje total: 5 puntos**

---

## 2.1 Integración con Backend y Consumo de API
**Puntaje máximo: 1.5 puntos**

La aplicación consume exclusivamente el backend desarrollado como core del proyecto. Todas las funcionalidades principales dependen de la API REST. Implementa correctamente los métodos HTTP (GET, POST, PUT, DELETE, PATCH) según corresponda. Maneja tokens JWT de manera segura usando el SDK de Expo (`SecureStore`). Los requests incluyen headers apropiados (`Authorization`, `Content-Type`). Implementa interceptores para manejo centralizado de autenticación. No hay dependencia de datos en memoria para funcionalidades core.

---

## 2.2 Arquitectura y Separación de Responsabilidades
**Puntaje máximo: 1 punto**

Arquitectura claramente modular con separación completa de capas: servicios/API (axios configurado con `baseURL`, interceptores), lógica de negocio (custom hooks, Context API) y UI (componentes presentacionales). Usa React Native como framework principal. Implementa custom hooks para lógica reutilizable. Context API o state management para estado global. Componentes funcionales con hooks (`useState`, `useEffect`, `useContext`, `useReducer`). Código limpio y organizado en carpetas lógicas (`screens`, `components`, `services`, `hooks`, `contexts`, `utils`). Nombres descriptivos en inglés para variables, funciones y componentes.

---

## 2.3 Sensores y APIs Externas
**Puntaje máximo: 1.5 puntos**

Implementa al menos dos sensores del dispositivo que aporten valor real al proyecto (cámara para fotos/QR, GPS para ubicación, acelerómetro para gestos, giroscopio, micrófono, etc.). Los sensores están integrados correctamente usando `expo-camera`, `expo-location` u otras librerías apropiadas. Consume al menos una API externa relevante al proyecto (mapas, clima, pagos, etc.). Maneja permisos correctamente con mensajes claros al usuario. Implementa fallbacks cuando los sensores no están disponibles.

---

## 2.4 Manejo de Errores y Estados de Carga
**Puntaje máximo: 1 punto**

Implementa manejo completo de errores con `try-catch` en todas las llamadas API. Muestra mensajes de error amigables y específicos al usuario (no técnicos). Implementa estados de carga (loading) con indicadores visuales (spinners, skeletons). Maneja errores de red, timeouts, errores 4xx y 5xx apropiadamente. Implementa retry logic para errores recuperables. Muestra feedback visual para acciones exitosas (confirmaciones, toasts). Valida datos antes de enviar requests. Maneja casos edge (listas vacías, sin conexión, etc.) con mensajes apropiados.

---

## Resumen de Puntajes

| Sección | Puntaje Máximo |
|---------|---------------|
| 2.1 Integración con Backend y Consumo de API | 1.5 pts |
| 2.2 Arquitectura y Separación de Responsabilidades | 1.0 pt |
| 2.3 Sensores y APIs Externas | 1.5 pts |
| 2.4 Manejo de Errores y Estados de Carga | 1.0 pt |
| **Total** | **5.0 pts** |