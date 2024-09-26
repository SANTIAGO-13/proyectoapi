import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Partido = sequelize.define('Partido', {
    equipoLocalId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    equipoVisitanteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    resultado: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Partido;

