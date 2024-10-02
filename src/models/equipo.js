import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Equipo = sequelize.define('Equipo', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    escudo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Opciones adicionales
    tableName: 'equipos', // Asegúrate de que este nombre esté en minúsculas
    timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export default Equipo;





