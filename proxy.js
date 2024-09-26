import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './db.js'; 
import Registro from './src/models/registro.js'; 
import Inicio from './src/models/inicio.js'; 
import bcrypt from 'bcrypt';
import Pais from './src/models/pais.js'; 
import Liga from './src/models/liga.js';
import Equipo from './src/models/equipo.js';
import Partido from './src/models/partido.js';
import Alineaciones from './src/models/alineaciones.js'; 

const app = express();
const PORT = 3001;

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3001',
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'src')));

// Servir archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

const pages = ['home.html', 'futbol.html', 'crud.html', 'inicio.html', 'registro.html'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'src', 'pages', page));
    });
});

// Ruta para registrar un nuevo usuario
app.post('/api/registro', async (req, res) => {
    const { nombre, segundoNombre, apellido, segundoApellido, email, fechaNacimiento, contrasena } = req.body;

    try {
        const hash = await bcrypt.hash(contrasena, 10); // Encriptar la contraseña
        const nuevoUsuario = await Registro.create({ 
            nombre, 
            segundoNombre, 
            apellido, 
            segundoApellido, 
            email, 
            fechaNacimiento, 
            contrasena: hash 
        });

        // Crear registro en la tabla de inicios
        await Inicio.create({ registroId: nuevoUsuario.id, contrasena: hash });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Ruta para iniciar sesión
app.post('/api/inicio', async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        const usuario = await Registro.findOne({ where: { email } });
        if (usuario) {
            const inicio = await Inicio.findOne({ where: { registroId: usuario.id } });
            if (inicio) {
                const match = await bcrypt.compare(contrasena, inicio.contrasena); // Comparar la contraseña
                if (match) {
                    res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
                } else {
                    res.status(401).json({ error: 'Credenciales inválidas' });
                }
            } else {
                res.status(401).json({ error: 'Credenciales inválidas' });
            }
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Proxy para la API de fútbol
app.get('/api/*', async (req, res) => {
    const url = req.url.replace('/api/', 'https://v3.football.api-sports.io/');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '2fbd26f676351d37145a6afe9dedf6564028f6533e7f74d782210df9770ae4be',
                'x-rapidapi-host': 'v3.football.api-sports.io',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data from the API' });
    }
});

// Sincronizar modelos y iniciar el servidor
async function startServer() {
    try {
        await sequelize.sync({ force: true }); // Cambiar a `sync()` para no forzar la creación de tablas en producción
        console.log('Tablas creadas');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
}

startServer();

















