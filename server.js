const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

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
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL de Clever Cloud');
});

// Ruta de login
app.post('/api/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ 
                success: false, 
                message: 'Correo y contraseña son requeridos' 
            });
        }

        // Buscar el usuario por correo
        const query = `
            SELECT u.*, r.rol as nombre_rol 
            FROM Usuario u
            JOIN Rol r ON u.id_rol = r.id_rol
            WHERE u.correo = ?
        `;
        
        db.query(query, [correo], async (err, results) => {
            if (err) {
                console.error('Error en la consulta de usuario:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error del servidor al buscar el usuario' 
                });
            }

            // Verificar si el usuario existe
            if (results.length === 0) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Credenciales inválidas' 
                });
            }

            const usuario = results[0];
            let contrasenaValida = false;

            // Verificar si la contraseña está hasheada
            if (usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$')) {
                // La contraseña está hasheada
                contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
            } else {
                // La contraseña está en texto plano
                contrasenaValida = (contrasena === usuario.contrasena);
                
                // Actualizar a contraseña hasheada
                if (contrasenaValida) {
                    const hashedPassword = await bcrypt.hash(contrasena, 10);
                    db.query('UPDATE Usuario SET contrasena = ? WHERE id_usuario = ?', 
                        [hashedPassword, usuario.id_usuario]);
                }
            }
            
            if (!contrasenaValida) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Credenciales inválidas' 
                });
            }

            // Crear el token JWT
            const token = jwt.sign(
                { 
                    id: usuario.id_usuario, 
                    email: usuario.correo,
                    rol: usuario.nombre_rol,
                    nombre: usuario.nombre
                }, 
                process.env.JWT_SECRET || 'tu_secreto_seguro',
                { expiresIn: '24h' }
            );

            // No enviar la contraseña en la respuesta
            delete usuario.contrasena;

            // Enviar respuesta exitosa
            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                token,
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo,
                    rol: usuario.nombre_rol
                }
            });
        });
    } catch (error) {
        console.error('Error en el proceso de login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error en el servidor' 
        });
    }
});

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token no proporcionado' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_seguro');
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token inválido o expirado' 
        });
    }
};

// Ruta protegida de ejemplo
app.get('/api/perfil', verificarToken, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Acceso concedido',
        usuario: req.usuario
    });
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Accede a: http://localhost:${PORT}`);
});

module.exports = app;