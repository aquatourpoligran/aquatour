# AquaTour CRM - Sistema de Gestión de Clientes

Sistema CRM desarrollado para AquaTour Travel Agency con funcionalidades específicas para gestión de clientes, reservas, paquetes turísticos y reportes.

## 🚀 Características

- **Autenticación por roles**: SuperAdministrador, Administrador, Asesor
- **Interfaz moderna**: Diseño responsive con gradientes morado-azul
- **Base de datos MySQL**: Integración con Clever Cloud
- **Seguridad JWT**: Tokens de autenticación seguros
- **Validación en tiempo real**: Feedback inmediato en formularios

## 📋 Requisitos

- Node.js (v14 o superior)
- MySQL (Clever Cloud)
- NPM o Yarn

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd aquatour-crm
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Edita el archivo `.env` con tus credenciales de Clever Cloud:
   ```env
   # Configuración de Base de Datos MySQL (Clever Cloud)
   DB_HOST=tu_host_clever_cloud
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=tu_base_datos
   DB_PORT=3306

   # JWT Secret
   JWT_SECRET=aquatour_crm_secret_key_2024

   # Puerto del servidor
   PORT=5000
   ```

4. **Crear usuario de prueba** (opcional)
   
   Ejecuta este SQL en tu base de datos para crear un usuario de prueba:
   ```sql
   -- Insertar roles
   INSERT INTO Rol (rol, descripcion) VALUES 
   ('Superadministrador', 'Acceso completo al sistema'),
   ('Administrador', 'Gestión operativa'),
   ('Asesor', 'Gestión de clientes y ventas');

   -- Crear usuario de prueba (contraseña: admin123)
   INSERT INTO Usuario (nombre, apellido, tipo_documento, num_documento, correo, contrasena, id_rol) 
   VALUES ('Admin', 'Sistema', 'Cedula Ciudadania', '12345678', 'admin@aquatour.com', 
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);
   ```

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## 🔐 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| SuperAdministrador | admin@aquatour.com | admin123 |

## 📁 Estructura del Proyecto

```
aquatour-crm/
├── public/
│   ├── index.html          # Página de login
│   ├── styles.css          # Estilos CSS
│   ├── script.js           # JavaScript del frontend
│   └── logo-aquatour.svg   # Logo de AquaTour
├── server.js               # Servidor Express
├── package.json            # Dependencias del proyecto
├── .env                    # Variables de entorno
└── README.md              # Documentación
```

## 🎨 Diseño

El sistema utiliza el esquema de colores oficial de AquaTour:
- **Primario**: Gradiente morado (#6B46C1) a azul (#3B82F6)
- **Secundario**: Azul claro (#06B6D4)
- **Fondo**: Gradiente diagonal
- **Tipografía**: Segoe UI, moderna y legible

## 🔧 API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión
- `GET /api/verify-token` - Verificar token JWT

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración de 8 horas
- Validación de entrada en frontend y backend
- Protección CORS configurada

## 📱 Responsive Design

El sistema es completamente responsive y se adapta a:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚧 Próximas Funcionalidades

- Dashboard por roles
- Gestión de clientes
- Sistema de cotizaciones
- Reportes y estadísticas
- Recuperación de contraseña
- Notificaciones en tiempo real

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contacta al equipo de desarrollo.

---

**AquaTour Travel Agency** - Sistema CRM v1.0
