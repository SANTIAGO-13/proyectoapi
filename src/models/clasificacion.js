import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Clasificacion = sequelize.define('Clasificacion', {
    nombreEquipo: { // Nuevo campo para el nombre del equipo
        type: DataTypes.STRING,
        allowNull: false
    },
    posicion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    partidosJugados: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    victorias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    empates: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    derrotas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    golesAFavor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    golesEnContra: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    escudoEquipo: { // Nuevo campo para el escudo del equipo
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'clasificacions',
    timestamps: true
});

export default Clasificacion;






