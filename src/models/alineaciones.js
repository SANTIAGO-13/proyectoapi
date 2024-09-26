import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Alineacion = sequelize.define('Alineacion', {
    partidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Partidos', // Asegúrate de que la tabla de Partidos esté definida
            key: 'id'
        }
    },
    equipoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Equipos', // Asegúrate de que la tabla de Equipos esté definida
            key: 'id'
        }
    },
    entrenador: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alineacionInicial: {
        type: DataTypes.JSON, // Para almacenar la alineación inicial
        allowNull: false
    },
    suplentes: {
        type: DataTypes.JSON, // Para almacenar los suplentes
        allowNull: false
    }
});

export default Alineacion;
