## README - Microservicio de Inventario (management_inventory)

### Descripción General

El microservicio `management_inventory` es un servicio Node.js que maneja la gestión completa del inventario dentro del sistema ERP. Se ejecuta en el puerto 9000 y proporciona APIs para la gestión de productos, categorías, proveedores y entradas de inventario.

### Arquitectura del Servicio

El servicio sigue una arquitectura en capas con Express.js:

**Rutas principales:**

- `/api/products` - Gestión del catálogo de productos
- `/api/providers` - Gestión de proveedores
- `/api/entrances` - Registro de entradas de inventario
- `/api/categories` - Gestión de categorías
- `/api/reports` - Reportes de inventario

### Modelos de Datos

#### Modelo de Productos (`productModel`)

Gestiona el catálogo de productos con validación Joi

**Métodos principales:**

- `create()` - Creación de productos con verificación de nombres únicos
- `listAll()` - Listado completo de productos
- `findById()` - Búsqueda por ID
- `updateStock()` - Actualización atómica de stock

#### Modelo de Entradas (`entranceModel`)

Maneja las entradas de inventario con transacciones atómicas

**Funcionalidad clave:**

- Registro de entradas con actualización automática de stock
- Validación de proveedores y productos
- Transacciones con rollback automático

#### Modelo de Proveedores (`providerModel`)

Gestión de información de proveedores

#### Modelo de Categorías (`categoryModel`)

Gestión simple de categorías de productos

### Configuración de Base de Datos

El servicio se conecta a MySQL usando connection pooling

### APIs Principales

#### Productos

- `POST /api/products/create` - Crear producto
- `GET /api/products` - Listar productos
- `GET /api/products/find/:id` - Buscar producto
- `PUT /api/products/:id` - Actualizar producto
- `PATCH /api/products/:id/stock` - Actualizar solo stock
- `DELETE /api/products/:id` - Eliminar producto

#### Entradas de Inventario

- `POST /api/entrances/create` - Registrar entrada
- `GET /api/entrances` - Listar entradas
- `DELETE /api/entrances/:id` - Eliminar entrada

### Características Técnicas

**Gestión de UUIDs:**
El sistema utiliza funciones nativas de MySQL para manejo eficiente de UUIDs:

- `UUID_TO_BIN()` para almacenamiento
- `BIN_TO_UUID()` para recuperación
- `crypto.randomUUID()` para generación

**Transacciones:**
Operaciones críticas usan transacciones con bloqueo `FOR UPDATE` para prevenir condiciones de carrera, especialmente en actualizaciones de stock.

**Validación:**
Todos los modelos implementan validación Joi antes de operaciones de base de datos.

### Middleware de Autenticación

El servicio incluye middleware JWT para autenticación

### Reportes

El servicio proporciona endpoints de reportes para:

- Productos con stock bajo
- Movimientos de inventario (entradas y salidas)
- Ventas por categoría

### Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
PORT=9000

# Ejecutar servidor
npm run dev
```

### Dependencias Principales

- Express.js - Framework web
- mysql2 - Cliente MySQL con soporte para promesas
- Joi - Validación de esquemas
- jsonwebtoken - Autenticación JWT
- cors - Manejo de CORS
- dotenv - Variables de entorno

**Notes**

Este microservicio forma parte de un sistema ERP más amplio que incluye servicios de ventas (`management_sales`), clientes (`management_customer`) y autenticación (`management_login`). El servicio de inventario se comunica con otros servicios a través de APIs REST, especialmente para actualizaciones de stock durante las ventas.
