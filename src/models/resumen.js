import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Resumen = sequelize.define('Resumen', {
    partidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Partidos', // Asegúrate de que este nombre coincida con el modelo de partidos
            key: 'id'
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export default Resumen;
