## README para el Microservicio Customer (management_customer)

El microservicio `management_customer` es responsable de la gestión de clientes y análisis de datos de clientes dentro del sistema ERP.

### Arquitectura del Servicio

El servicio sigue un patrón típico de Express.js con separación clara entre rutas, lógica de negocio y acceso a datos:

- **Puerto**: 9000 (configurable via `process.env.PORT`)
- **Base de datos**: MySQL (`api_prueba2`)
- **Rutas principales**: `/api/clients` y `/api/reports`

### Endpoints de la API

#### Gestión de Clientes

| Método | Endpoint                | Descripción               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/api/clients/create`   | Crear nuevo cliente       |
| GET    | `/api/clients/`         | Listar todos los clientes |
| GET    | `/api/clients/find/:id` | Obtener cliente por ID    |
| PUT    | `/api/clients/:id`      | Actualizar cliente        |
| DELETE | `/api/clients/:id`      | Eliminar cliente          |

#### Reportes y Análisis

| Método | Endpoint                   | Descripción                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | `/api/reports/top-clients` | Top 10 clientes por gasto total |

### Modelo de Datos

El servicio utiliza validación con Joi para los datos de clientes:

```javascript
{
  names: string (requerido),
  lastnames: string (requerido),
  dni: string (requerido),
  email: string email válido (requerido),
  direction: string (requerido)
}
```

### Características Técnicas

#### Gestión de Transacciones

- Uso de transacciones MySQL con rollback automático
- Bloqueo de filas (`FOR UPDATE`) para prevenir duplicados
- Generación de UUIDs para identificadores únicos [6]

#### Conexión a Base de Datos

- Pool de conexiones MySQL2 con soporte para promesas
- Configuración estándar para localhost

### Instalación y Configuración

1. **Instalar dependencias**:

```bash
npm install express mysql2 joi cors dotenv crypto
```

2. **Variables de entorno**:

```env
PORT=3001
```

3. **Ejecutar el servicio**:

```bash
npm run dev
```

### Integración con Otros Servicios

El servicio se integra con:

- **management_sales**: Los IDs de clientes se referencian en la tabla `ventas`
- **Frontend React**: Proporciona API REST consumida por componentes React
- **Base de datos compartida**: Comparte la base `api_prueba2` con otros microservicios

### Manejo de Errores

El servicio implementa manejo centralizado de errores con códigos HTTP estándar:

- 200: Operaciones exitosas
- 400: Errores de validación
- 404: Cliente no encontrado
- 500: Errores internos del servidor

## Notes

El microservicio `management_customer` forma parte de una arquitectura de microservicios más amplia que incluye servicios de autenticación, inventario y ventas. Utiliza UUIDs binarios para eficiencia en la base de datos y implementa patrones robustos de transacciones para garantizar la integridad de los datos.
