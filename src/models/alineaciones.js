import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Alineacion = sequelize.define('Alineacion', {
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
    },
}, {
    // Opciones adicionales
    tableName: 'alineacions',
    timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

export default Alineacion;



