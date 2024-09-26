import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Liga = sequelize.define('Liga', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paisId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Liga;


