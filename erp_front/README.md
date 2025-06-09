## README - Frontend ERP inventaryFact

El frontend `erp_front` es una aplicación React SPA que proporciona la interfaz de usuario para el sistema ERP inventaryFact.

### Tecnologías Principales

**Framework y Librerías Core:**

- React 19.0.0 con React DOM
- Redux Toolkit para gestión de estado global
- React Router DOM para navegación SPA
- Vite como build tool y servidor de desarrollo

**UI y Estilos:**

- Material-UI (@mui/material, @mui/x-data-grid) para componentes
- Styled Components para estilos personalizados
- React Icons para iconografía

**Funcionalidades Específicas:**

- Axios para comunicación HTTP con microservicios
- React DatePicker para selección de fechas
- XLSX y File-saver para exportación de reportes
- Recharts para visualización de datos

### Arquitectura de la Aplicación

#### Punto de Entrada

La aplicación se inicializa con React 18 StrictMode, Redux Provider y BrowserRouter

#### Configuración de Rutas

El sistema de rutas está centralizado en `MyRoutes.jsx` con rutas anidadas bajo `/admin`

#### Gestión de Estado Redux

El store Redux está configurado con múltiples slices para cada dominio de negocio

### Estructura de Componentes

#### Dashboard Principal

El componente `Dashboard` actúa como layout principal con navegación lateral y área de contenido

#### Patrón de Módulos de Negocio

Cada módulo sigue un patrón consistente con componente contenedor, lista y creación:

- **Productos**
- **Clientes**
- **Ventas**

### Comunicación con Backend

#### Configuración de APIs

Las URLs de los microservicios están centralizadas en `api.js`

#### Autenticación

Los headers de autenticación se configuran automáticamente con JWT tokens

### Módulos Principales

#### Sistema de Reportes

El módulo de reportes proporciona 6 tipos diferentes de análisis de negocio

Los reportes incluyen exportación a Excel

#### Gestión de Inventario

Incluye componentes para entradas de inventario con validación

### Instalación y Configuración

```bash
# Instalar dependencias
cd erp_front/
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con Vite
- `npm run build` - Build de producción
- `npm run lint` - Linting con ESLint
- `npm run preview` - Preview del build de producción

### Estructura de Directorios

```
erp_front/
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── main/          # Layouts principales
│   │       ├── client/        # Gestión de clientes
│   │       ├── inventory/     # Gestión de productos
│   │       ├── sale/          # Gestión de ventas
│   │       ├── report/        # Sistema de reportes
│   │       └── user/          # Autenticación
│   ├── store/
│   │   ├── slices/           # Redux slices
│   │   ├── store.js          # Configuración del store
│   │   └── api.js            # URLs y configuración HTTP
│   ├── routes/
│   │   └── MyRoutes.jsx      # Configuración de rutas
│   └── styles/               # Estilos compartidos
├── package.json
└── vite.config.js
```

### Características Principales

- **Autenticación JWT** con protección de rutas
- **Dashboard responsivo** con navegación lateral
- **CRUD completo** para todas las entidades
- **Sistema de reportes** con exportación Excel
- **Gestión de estado** centralizada con Redux
- **Componentes reutilizables** con Material-UI
- **Validación de formularios** en tiempo real

## Notes

Este README cubre específicamente el frontend React del sistema ERP. El frontend se comunica con 4 microservicios backend diferentes (autenticación, inventario, clientes, ventas) a través de APIs REST. La aplicación está optimizada para uso administrativo con un dashboard completo de gestión empresarial.
