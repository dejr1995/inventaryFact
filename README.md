## README General - Sistema ERP inventaryFact

---

## Tabla de Contenidos
* [Descripción General](#descripción-general)
* [Arquitectura del Sistema](#arquitectura-del-sistema)
* [Tecnologías Utilizadas](#tecnologías-utilizadas)
* [Estructura de Microservicios](#estructura-de-microservicios)
* [Comunicación Entre Servicios](#comunicación-entre-servicios)
* [Gestión de Estado Frontend](#gestión-de-estado-frontend)
* [Instalación y Configuración](#instalación-y-configuración)
* [Características Principales](#características-principales)
* [Seguridad](#seguridad)
* [Notas](#notas)

---

El sistema `inventaryFact` es una aplicación ERP completa que implementa una arquitectura de microservicios con Node.js y React. 

### Arquitectura del Sistema

El sistema está compuesto por:

**Backend - Microservicios:**
* **`management_login`** (Puerto 9000) - Autenticación y gestión de usuarios
* **`management_customer`** (Puerto 3001) - Gestión de clientes
* **`management_inventory`** (Puerto 3000) - Gestión de inventario y productos
* **`management_sales`** (Puerto 3002) - Gestión de ventas y reportes

**Frontend:**
* **`erp_front`** - Aplicación React con Redux para gestión de estado 

**Base de Datos:**
- MySQL (`api_prueba2`) - Base de datos centralizada compartida por todos los microservicios

### Tecnologías Utilizadas

**Backend:**
- Node.js con Express.js
- MySQL2 para conexiones a base de datos
- Joi para validación de datos
- bcrypt para hash de contraseñas
- CORS para comunicación cross-origin
- UUID para identificadores únicos

**Frontend:**
- React 18+
- Redux Toolkit para gestión de estado
- Axios para comunicación HTTP
- React Router para navegación
- Styled Components para estilos

### Estructura de Microservicios

Cada microservicio sigue un patrón arquitectónico consistente:

```
microservicio/
├── server.js              # Punto de entrada
├── src/
│   ├── routes/            # Definición de rutas
│   ├── models/            # Modelos de datos
│   ├── services/          # Servicios (DB, etc.)
│   └── controllers/       # Controladores
└── package.json
```

### Comunicación Entre Servicios

Los microservicios se comunican mediante HTTP REST APIs. El servicio de ventas (`management_sales`) consume APIs de inventario y clientes para operaciones transaccionales.

### Gestión de Estado Frontend

El frontend utiliza Redux Toolkit con slices especializados para cada dominio:
- `AuthSlice` - Autenticación y perfil de usuario
- `SaleSlice` - Gestión de ventas

### Instalación y Configuración

1. **Configurar Base de Datos:**
   - Crear base de datos MySQL `api_prueba2`
   - Configurar credenciales en cada microservicio

2. **Instalar Dependencias:**
   ```bash
   # Para cada microservicio
   cd management_*/
   npm install
   
   # Para el frontend
   cd erp_front/
   npm install
   ```

3. **Variables de Entorno:**
   Configurar archivos `.env` en cada microservicio con:
   - `PORT` - Puerto del servicio
   - `SUPERADMIN_ROLE_UUID`, `ADMIN_ROLE_UUID`, `USER_ROLE_UUID` - UUIDs de roles

4. **Ejecutar Servicios:**
   ```bash
   # Cada microservicio
   npm start
   
   # Frontend
   npm run dev
   ```

### Características Principales

- **Autenticación JWT** con roles de usuario
- **Gestión de Inventario** con control de stock
- **Sistema de Ventas** con facturación
- **Gestión de Clientes** y proveedores
- **Reportes y Analytics** por módulo
- **Transacciones Atómicas** para integridad de datos 

### Seguridad

- Validación de datos con esquemas Joi
- Hash de contraseñas con bcrypt
- Manejo de transacciones para consistencia
- Gestión de errores centralizada 

## Notes

Este README general proporciona una visión completa del sistema ERP inventaryFact. Cada microservicio mantiene su propio README específico con detalles de implementación, mientras que este documento sirve como punto de entrada para entender la arquitectura completa del sistema.
