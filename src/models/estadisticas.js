import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Estadisticas = sequelize.define('Estadisticas', {
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
}, {
    // Opciones adicionales
    tableName: 'estadisticas',
    timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export default Estadisticas;




