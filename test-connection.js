const mysql = require('mysql2');
require('dotenv').config();

console.log('🔍 Probando conexión a la base de datos...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT);
console.log('-----------------------------------');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'b8efu6n5kvpd18l7euw3-mysql.services.clever-cloud.com',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 10000 // 10 segundos
});

// Intentar conectar
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:');
        console.error('Código:', err.code);
        console.error('Mensaje:', err.message);
        console.error('Hostname:', err.hostname);
        console.error('Syscall:', err.syscall);
        console.error('Fatal:', err.fatal);
        process.exit(1);
    } else {
        console.log('✅ ¡Conexión exitosa a la base de datos!');
        
        // Probar una consulta simple
        db.query('SELECT 1 as test', (err, results) => {
            if (err) {
                console.error('❌ Error ejecutando consulta de prueba:', err);
            } else {
                console.log('✅ Consulta de prueba exitosa:', results);
            }
            
            // Cerrar conexión
            db.end(() => {
                console.log('🔒 Conexión cerrada.');
                process.exit(0);
            });
        });
    }
});
