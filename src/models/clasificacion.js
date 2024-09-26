import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Clasificacion = sequelize.define('Clasificacion', {
    equipoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Equipos', // Asegúrate de que este nombre coincida con el modelo de equipos
            key: 'id'
        }
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
    }
});

export default Clasificacion;
