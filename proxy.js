import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './db.js'; 
import Registro from './src/models/registro.js'; 
import Inicio from './src/models/inicio.js'; 
import Resumen from './src/models/resumen.js'; 
import Estadisticas from './src/models/estadisticas.js'; 
import Clasificacion from './src/models/clasificacion.js'; 
import Alineacion from './src/models/alineaciones.js'; 
import Pais from './src/models/pais.js'; 
import Liga from './src/models/liga.js';
import Equipo from './src/models/equipo.js';
import Partido from './src/models/partido.js'; 
import bcrypt from 'bcrypt';

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

// Servir archivos HTML
app.get('/inicio.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'inicio.html'));
});

// Servir archivos HTML
app.get('/registro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'registro.html'));
});

// Servir archivos HTML
app.get('/futbol.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'futbol.html'));
});

// Servir archivos HTML
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'home.html'));
});

// Servir archivos HTML
app.get('/crud.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'crud.html'));
});

// Servir archivos HTML
app.get('/analisticas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'analisticas.html'));
});

// Servir archivos HTML
app.get('/salir.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'salir.html'));
});

// Sincronizar modelos y cargar datos de la API
async function syncAndLoadData() {
    try {
        await sequelize.sync({ force: false }); // Cambia a true solo si necesitas recrear las tablas
        console.log('Tablas sincronizadas');
        await loadDataFromAPI();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
}

// Función para cargar datos de la API
async function loadDataFromAPI() {
    const KEY = "2fbd26f676351d37145a6afe9dedf6564028f6533e7f74d782210df9770ae4be";
    const LEAGUES_IDS = [302, 266, 207]; // IDs de ligas

    // Obtener ligas
    const leagues = await fetchAPI(`https://apiv3.apifootball.com/?action=get_leagues&APIkey=${KEY}`);
    console.log("Ligas obtenidas:", leagues);

    for (const league of leagues) {
        if (LEAGUES_IDS.includes(parseInt(league.league_id))) {
            // Guardar país
            const [pais] = await Pais.findOrCreate({
                where: { nombre: league.country_name },
                defaults: { bandera: league.country_logo }
            });
            console.log("País guardado:", pais);
            
            // Guardar liga
            const [liga] = await Liga.findOrCreate({
                where: { nombre: league.league_name },
                defaults: { paisId: pais.id }
            });
            console.log("Liga guardada:", liga);

            // Obtener equipos de la liga
            const teams = await fetchAPI(`https://apiv3.apifootball.com/?action=get_teams&league_id=${league.league_id}&APIkey=${KEY}`);
            console.log("Equipos obtenidos:", teams);
            
            for (const team of teams) {
                const [equipo] = await Equipo.findOrCreate({
                    where: { nombre: team.team_name },
                    defaults: { escudo: team.team_badge }
                });
                console.log("Equipo guardado:", equipo);
            }

            // Obtener partidos de la liga
            const matches = await fetchAPI(`https://apiv3.apifootball.com/?action=get_events&league_id=${league.league_id}&APIkey=${KEY}&from=2024-09-15&to=2024-09-15`);
            console.log("Partidos obtenidos:", matches);
            
            for (const match of matches) {
                const partidoExistente = await Partido.findOne({
                    where: { 
                        fecha: match.match_date,
                        equipoLocal: match.match_hometeam_name,
                        equipoVisitante: match.match_awayteam_name
                    }
                });

                if (!partidoExistente) {
                    const partido = await Partido.create({
                        equipoLocal: match.match_hometeam_name,
                        equipoVisitante: match.match_awayteam_name,
                        fecha: match.match_date,
                        resultado: `${match.match_hometeam_score} - ${match.match_awayteam_score}`,
                        estado: match.match_status,
                        estadio: match.match_stadium,
                        arbitro: match.match_referee
                    });
                    console.log("Partido guardado:", partido);

                    // Obtener alineaciones
                    const alineaciones = await fetchAPI(`https://apiv3.apifootball.com/?action=get_lineups&match_id=${match.match_id}&APIkey=${KEY}`);
                    if (alineaciones && alineaciones[match.match_id]) {
                        const lineup = alineaciones[match.match_id].lineup;

                        // Guardar alineaciones
                        await Alineacion.create({
                            partidoId: partido.id,
                            equipoId: match.match_hometeam_id,
                            entrenador: lineup.home.coach[0].lineup_player,
                            alineacionInicial: JSON.stringify(lineup.home.starting_lineups),
                            suplentes: JSON.stringify(lineup.home.substitutes)
                        });
                        await Alineacion.create({
                            partidoId: partido.id,
                            equipoId: match.match_awayteam_id,
                            entrenador: lineup.away.coach[0].lineup_player,
                            alineacionInicial: JSON.stringify(lineup.away.starting_lineups),
                            suplentes: JSON.stringify(lineup.away.substitutes)
                        });
                        console.log("Alineaciones guardadas para el partido:", partido.id);
                    }

                    // Obtener estadísticas
                    const stats = await fetchAPI(`https://apiv3.apifootball.com/?action=get_statistics&match_id=${match.match_id}&APIkey=${KEY}`);
                    console.log("Estadísticas obtenidas:", stats);
                    if (stats && stats[match.match_id] && Array.isArray(stats[match.match_id].statistics)) {
                        for (const stat of stats[match.match_id].statistics) {
                            await Estadisticas.create({
                                tipo: stat.type,
                                local: stat.home,
                                visitante: stat.away
                            });
                            console.log("Estadísticas guardadas para el partido:", partido.id);
                        }
                    } else {
                        console.warn('No hay estadísticas disponibles o stats no es un array:', stats);
                    }

                    // Obtener resumen
                    const resumen = match; // Utilizamos el objeto match directamente para obtener el resumen
                    
                    // Extraer y formatear los datos del resumen
                    const goles = resumen.goalscorer || [];
                    const tarjetas = resumen.cards || [];
                    const asistencias = goles.map(goleador => {
                        return {
                            jugador: goleador.home_scorer || goleador.away_scorer,
                            minuto: goleador.time,
                            asistente: goleador.home_assist || goleador.away_assist
                        };
                    });
                    const sustituciones = resumen.substitutions || {};

                    // Log para verificar los datos extraídos
                    console.log("Goleadores:", goles);
                    console.log("Tarjetas:", tarjetas);
                    console.log("Asistencias:", asistencias);
                    console.log("Sustituciones:", sustituciones);

                    // Convertir a cadenas de texto
                    await Resumen.create({
                        goleadores: formatGoleadores(goles),
                        tarjetas: formatTarjetas(tarjetas),
                        asistencias: formatAsistencias(asistencias),
                        sustituciones: formatSustituciones(sustituciones)
                    });
                    console.log("Resumen guardado para el partido:", partido.id);
                } else {
                    console.log("Partido ya existe:", partidoExistente);
                }
            }

            // Obtener clasificaciones
            const standingsData = await fetchAPI(`https://apiv3.apifootball.com/?action=get_standings&league_id=${league.league_id}&APIkey=${KEY}`);
            console.log("Clasificaciones obtenidas:", standingsData);

            if (standingsData && Array.isArray(standingsData)) {
                for (const standing of standingsData) {
                    await Clasificacion.create({
                        posicion: parseInt(standing.overall_league_position), // Convertir a entero
                        partidosJugados: parseInt(standing.overall_league_payed),
                        victorias: parseInt(standing.overall_league_W),
                        empates: parseInt(standing.overall_league_D),
                        derrotas: parseInt(standing.overall_league_L),
                        golesAFavor: parseInt(standing.overall_league_GF),
                        golesEnContra: parseInt(standing.overall_league_GA),
                        puntos: parseInt(standing.overall_league_PTS),
                        nombreEquipo: standing.team_name, // Almacenar el nombre del equipo
                        escudoEquipo: standing.team_badge // Almacenar el escudo del equipo
                    });
                    console.log("Clasificación guardada:", standing);
                }
            } else {
                console.warn('No se encontraron datos de clasificación o standingsData no es un array.');
            }
        }
    }
}

// Función para formatear goleadores
function formatGoleadores(goles) {
    if (!goles || goles.length === 0) return 'No hay goleadores';
    return goles.map(g => {
        const homeScorer = g.home_scorer ? `${g.home_scorer} (Asistió: ${g.home_assist || 'N/A'})` : '';
        const awayScorer = g.away_scorer ? `${g.away_scorer} (Asistió: ${g.away_assist || 'N/A'})` : '';
        return `${homeScorer} ${g.score} min:${g.time}<br>${awayScorer}`;
    }).join('<br>').trim();
}

// Función para formatear tarjetas
function formatTarjetas(tarjetas) {
    if (!tarjetas || tarjetas.length === 0) return 'No hay tarjetas';
    return tarjetas.map(t => {
        const homeFault = t.home_fault ? `${t.home_fault} (Tarjeta: ${t.card})` : '';
        const awayFault = t.away_fault ? `${t.away_fault} (Tarjeta: ${t.card})` : '';
        return `${homeFault} min:${t.time}<br>${awayFault}`;
    }).join('<br>').trim();
}

// Función para formatear asistencias
function formatAsistencias(asistencias) {
    if (!asistencias || asistencias.length === 0) return 'No hay asistencias';
    return asistencias.map(a => `${a.jugador} (min:${a.minuto})${a.asistente ? ` Asistió: ${a.asistente}` : ''}`).join('<br>');
}

// Función para formatear sustituciones
function formatSustituciones(sustituciones) {
    const homeSubs = (sustituciones.home || []).map(s => `${s.substitution} (min:${s.time})`).join('<br>') || 'No hay sustituciones';
    const awaySubs = (sustituciones.away || []).map(s => `${s.substitution} (min:${s.time})`).join('<br>') || 'No hay sustituciones';
    return `Local:<br>${homeSubs}<br>Visitante:<br>${awaySubs}`;
}

// Función para hacer la solicitud a la API
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud a la API:', error);
        return []; // Devuelve un array vacío en caso de error
    }
}

// Ruta para registrar un nuevo usuario
app.post('/api/registro', async (req, res) => {
    const { nombre, segundoNombre, apellido, segundoApellido, email, fechaNacimiento, contrasena } = req.body;

    try {
        const hash = await bcrypt.hash(contrasena, 10);
        const nuevoUsuario = await Registro.create({ 
            nombre, 
            segundoNombre, 
            apellido, 
            segundoApellido, 
            email, 
            fechaNacimiento, 
            contrasena: hash 
        });

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
                const match = await bcrypt.compare(contrasena, inicio.contrasena);
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

// Cargar datos al iniciar
syncAndLoadData();





































