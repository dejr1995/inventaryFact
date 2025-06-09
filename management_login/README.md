## README para el Microservicio de Autenticación (management_login)

### Descripción General

El microservicio `management_login` es el servicio central de autenticación del sistema ERP inventaryFact. Opera en el puerto 9000 y maneja toda la gestión de usuarios, autenticación JWT, control de acceso basado en roles y administración de empresas multi-tenant.

### Arquitectura del Servicio

- **Puerto:** 9000
- **Base de datos:** MySQL (`api_prueba2`)
- **Autenticación:** JWT con expiración de 8 horas

### Estructura del Proyecto

```
management_login/
├── server.js                    # Servidor principal y configuración de BD
├── src/
│   ├── routes/
│   │   └── auth.js             # Rutas de autenticación y gestión de usuarios
│   ├── models/
│   │   ├── authModel.js        # Modelo de usuarios y autenticación
│   │   └── roleModel.js        # Modelo de roles del sistema
│   ├── middlewares/
│   │   └── authMiddleware.js   # Middleware de autenticación JWT
│   └── services/
│       └── db.js               # Configuración de conexión a BD
└── utils/
    └── genAuthToken.js         # Generación de tokens JWT
```

### Endpoints Principales

| Método | Endpoint             | Roles Requeridos  | Descripción                                   |
| ------ | -------------------- | ----------------- | --------------------------------------------- |
| POST   | `/api/auth/login`    | Ninguno           | Autenticación de usuarios                     |
| POST   | `/api/auth/register` | Ninguno           | Registro público de usuarios                  |
| POST   | `/api/auth/users`    | superadmin, admin | Creación de usuarios con restricciones de rol |
| GET    | `/api/auth/me`       | admin, user       | Obtener perfil del usuario actual             |
| PUT    | `/api/auth/me`       | admin, user       | Actualizar perfil de usuario                  |
| GET    | `/api/auth/roles`    | Ninguno           | Obtener roles disponibles                     |
| POST   | `/api/auth/company`  | admin, user       | Gestión de información de empresa             |

### Sistema de Roles

El sistema implementa una jerarquía de tres niveles:

- **superadmin**: Acceso completo, puede crear usuarios admin
- **admin**: Gestión de empresa y usuarios, puede crear usuarios regulares
- **user**: Acceso limitado a funcionalidades básicas

### Configuración de Base de Datos

El servicio inicializa automáticamente las tablas necesarias al arrancar:

- `roles`: Roles del sistema con UUIDs predefinidos
- `usuarios`: Información de usuarios con relaciones a roles y empresas

### Autenticación JWT

Los tokens JWT incluyen la siguiente información:

- `user_id`: UUID del usuario
- `email`: Email del usuario
- `role`: Nombre del rol
- `empresa_id`: UUID de la empresa (multi-tenant)

### Middleware de Autenticación

El middleware `authenticate` valida tokens JWT y verifica permisos de rol antes de permitir acceso a endpoints protegidos.

### Instalación y Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```env
PORT=9000
JWT_SECRET_KEY=tu_clave_secreta
SUPERADMIN_ROLE_UUID=uuid_superadmin
ADMIN_ROLE_UUID=uuid_admin
USER_ROLE_UUID=uuid_user
```

3. Ejecutar el servicio:

```bash
npm run dev
```

### Dependencias Principales

- `express`: Framework web
- `jsonwebtoken`: Manejo de tokens JWT
- `bcrypt`: Encriptación de contraseñas
- `joi`: Validación de datos
- `mysql2`: Cliente de base de datos
- `cors`: Manejo de CORS

### Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Tokens JWT con expiración de 8 horas
- Validación de entrada con esquemas Joi
- Control de acceso basado en roles
- Transacciones de base de datos para operaciones críticas

**Notes**

Este microservicio es fundamental para el sistema ERP ya que todos los demás servicios (`management_inventory`, `management_sales`, `management_customer`) dependen de él para la autenticación y autorización. El servicio maneja tanto la autenticación básica como características avanzadas como multi-tenancy a través de empresas y jerarquías de roles complejas.
