import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Resumen = sequelize.define('Resumen', {
    goleadores: {
        type: DataTypes.TEXT, // Cambiado a TEXT para permitir más caracteres
        allowNull: true
    },
    tarjetas: {
        type: DataTypes.TEXT, // Cambiado a TEXT para permitir más caracteres
        allowNull: true
    },
    asistencias: {
        type: DataTypes.TEXT, // Cambiado a TEXT para permitir más caracteres
        allowNull: true
    },
    sustituciones: {
        type: DataTypes.TEXT, // Cambiado a TEXT para permitir más caracteres
        allowNull: true
    }
}, {
    tableName: 'resumens', // Asegúrate de que el nombre de la tabla sea correcto
    timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export default Resumen;







