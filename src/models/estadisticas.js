import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Estadisticas = sequelize.define('Estadisticas', {
    partidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Partidos', // Asegúrate de que este nombre coincida con el modelo de partidos
            key: 'id'
        }
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    local: {
        type: DataTypes.STRING,
        allowNull: false
    },
    visitante: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Estadisticas;
