import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3001', // Permitir solo este origen
}));

// Servir archivos estáticos (CSS, JS, imágenes) desde sus respectivas carpetas
app.use(express.static(path.join(__dirname, 'src'))); // Asegúrate de que sirva la carpeta 'src'

// Servir archivos HTML desde la carpeta 'src/pages'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

// Otras rutas para los archivos HTML
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'home.html'));
});

app.get('/futbol.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'futbol.html'));
});

app.get('/inicio.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'inicio.html'));
});

app.get('/registro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'registro.html'));
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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});











