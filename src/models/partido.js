import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Partido = sequelize.define('Partido', {
    equipoLocal: {
        type: DataTypes.STRING, // Almacena el nombre del equipo local
        allowNull: false,
    },
    equipoVisitante: {
        type: DataTypes.STRING, // Almacena el nombre del equipo visitante
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    resultado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false // Guarda el estado del partido
    },
    estadio: {
        type: DataTypes.STRING,
        allowNull: false // Guarda el nombre del estadio
    },
    arbitro: {
        type: DataTypes.STRING,
        allowNull: false // Guarda el nombre del árbitro
    },
    hora: {
        type: DataTypes.STRING, // Almacena la hora del partido
        allowNull: false
    },
    temporada: {
        type: DataTypes.STRING, // Almacena la temporada del partido
        allowNull: false
    }
}, {
    tableName: 'partidos', // Asegúrate de que este nombre esté en minúsculas
    timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export default Partido;








