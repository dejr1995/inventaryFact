# Management Sales - Microservicio de Ventas

Microservicio especializado en la gestión de ventas, datos de empresa y reportes del sistema ERP inventaryFact.

## Descripción

El servicio `management_sales` maneja el ciclo completo de ventas desde la creación de órdenes hasta el procesamiento de pagos, generación de facturas y análisis de ventas.

## Arquitectura

- **Puerto**: 3002 (configurable via `PORT` env variable)
- **Base de datos**: MySQL (`api_prueba2`)
- **Framework**: Express.js con middleware CORS y JSON parsing

## Estructura del Proyecto

```
management_sales/
├── server.js                 # Servidor principal
├── src/
│   ├── models/
│   │   ├── saleModel.js      # Modelo de ventas
│   │   └── companyModel.js   # Modelo de empresa
│   ├── routes/
│   │   ├── sales.js          # Rutas de ventas
│   │   ├── company.js        # Rutas de empresa
│   │   └── reports.js        # Rutas de reportes
│   └── services/
│       └── db.js             # Conexión a base de datos
```

## Endpoints Principales

### Ventas (`/api/sales`)

- `POST /create` - Crear nueva venta
- `GET /:id` - Obtener venta por ID
- `GET /` - Listar todas las ventas
- `PATCH /update-status/:id` - Actualizar estado de venta
- `PATCH /adjust-total/:id` - Ajustar total de venta

### Empresa (`/api/company`)

- `POST /add` - Agregar datos de empresa
- `PATCH /update` - Actualizar datos de empresa

### Reportes (`/api/reports`)

- `GET /sales` - Reporte detallado de ventas
- `GET /top-products` - Productos más vendidos
- `GET /sales-by-category` - Ventas por categoría

## Modelos de Datos

### Modelo de Ventas

El `saleModel` implementa validación con Joi y manejo de transacciones

**Métodos principales:**

- `createSale()` - Creación de venta con reserva de stock
- `getSale()` - Obtener venta con detalles
- `updateSaleStatus()` - Actualizar estado con manejo de stock

### Modelo de Empresa

El `companyModel` maneja datos fiscales de la empresa

## Comunicación Inter-Servicios

El servicio se comunica con otros microservicios via HTTP:

- **Productos**: `http://localhost:3000/api/products`
- **Clientes**: `http://localhost:3001/api/clients`

## Instalación y Configuración

1. **Instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

```bash
PORT=3002
```

3. **Configurar base de datos:**

4. **Ejecutar el servicio:**

```bash
npm run dev
```

## Características Técnicas

- **Validación**: Joi schemas para validación de datos
- **Transacciones**: Manejo completo de transacciones MySQL
- **UUIDs**: Uso de UUIDs binarios para optimización
- **Stock Management**: Control automático de inventario
- **Error Handling**: Middleware centralizado de errores

## Estados de Venta

| Estado      | Descripción     | Impacto en Stock |
| ----------- | --------------- | ---------------- |
| `Pendiente` | Estado inicial  | Stock reservado  |
| `Pagado`    | Pago confirmado | Sin cambios      |
| `Anulado`   | Venta cancelada | Stock restaurado |

## Notes

Este microservicio forma parte del sistema ERP inventaryFact y requiere que los servicios de inventario (`management_inventory`) y clientes (`management_customer`) estén ejecutándose para funcionar correctamente. La base de datos MySQL debe estar configurada con las tablas correspondientes del esquema ERP.
