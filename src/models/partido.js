import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Partido = sequelize.define('Partido', {
    equipoLocal: {
        type: DataTypes.STRING, // Cambiado a STRING para almacenar el nombre del equipo local
        allowNull: false,
    },
    equipoVisitante: {
        type: DataTypes.STRING, // Cambiado a STRING para almacenar el nombre del equipo visitante
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
        allowNull: false // Añadido para guardar el estado del partido
    },
    estadio: {
        type: DataTypes.STRING,
        allowNull: false // Añadido para guardar el nombre del estadio
    },
    arbitro: {
        type: DataTypes.STRING,
        allowNull: false // Añadido para guardar el nombre del árbitro
    }
}, {
    // Opciones adicionales
    tableName: 'partidos', // Asegúrate de que este nombre esté en minúsculas
    timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export default Partido;







