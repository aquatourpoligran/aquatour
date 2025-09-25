const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('🔧 Configurando base de datos para AquaTour CRM...');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000
});

// Conectar a la base de datos
db.connect(async (err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        process.exit(1);
    }
    
    console.log('✅ Conectado a la base de datos');
    
    try {
        // 1. Insertar roles
        console.log('📝 Insertando roles...');
        const rolesQuery = `
            INSERT IGNORE INTO Rol (rol, descripcion) VALUES 
            ('Superadministrador', 'Acceso completo al sistema'),
            ('Administrador', 'Gestión operativa'),
            ('Asesor', 'Gestión de clientes y ventas'),
            ('Cliente', 'Acceso limitado como cliente')
        `;
        
        await queryPromise(rolesQuery);
        console.log('✅ Roles insertados correctamente');
        
        // 2. Crear contraseña hasheada
        console.log('🔐 Generando contraseña hasheada...');
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('✅ Contraseña generada');
        
        // 3. Insertar usuario administrador
        console.log('👤 Creando usuario administrador...');
        const userQuery = `
            INSERT IGNORE INTO Usuario 
            (nombre, apellido, tipo_documento, num_documento, correo, contrasena, id_rol) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await queryPromise(userQuery, [
            'Admin',
            'Sistema', 
            'Cedula Ciudadania',
            '12345678',
            'admin@aquatour.com',
            hashedPassword,
            1 // ID del rol Superadministrador
        ]);
        console.log('✅ Usuario administrador creado');
        
        // 4. Crear usuario asesor de prueba
        console.log('👤 Creando usuario asesor...');
        const asesorPassword = await bcrypt.hash('asesor123', 10);
        
        await queryPromise(userQuery, [
            'Juan',
            'Pérez', 
            'Cedula Ciudadania',
            '87654321',
            'asesor@aquatour.com',
            asesorPassword,
            3 // ID del rol Asesor
        ]);
        console.log('✅ Usuario asesor creado');
        
        // 5. Verificar usuarios creados
        console.log('🔍 Verificando usuarios creados...');
        const verifyQuery = `
            SELECT u.nombre, u.apellido, u.correo, r.rol 
            FROM Usuario u 
            INNER JOIN Rol r ON u.id_rol = r.id_rol
        `;
        
        const users = await queryPromise(verifyQuery);
        console.log('👥 Usuarios en la base de datos:');
        users.forEach(user => {
            console.log(`   - ${user.nombre} ${user.apellido} (${user.correo}) - Rol: ${user.rol}`);
        });
        
        console.log('\n🎉 ¡Base de datos configurada exitosamente!');
        console.log('\n🔐 Credenciales de prueba:');
        console.log('   📧 Superadministrador: admin@aquatour.com / admin123');
        console.log('   📧 Asesor: asesor@aquatour.com / asesor123');
        console.log('\n🌐 Accede a: http://localhost:5000');
        
    } catch (error) {
        console.error('❌ Error configurando la base de datos:', error);
    } finally {
        db.end();
        process.exit(0);
    }
});

// Función helper para promisificar queries
function queryPromise(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}
