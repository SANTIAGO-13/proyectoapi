import { DataTypes } from 'sequelize';
import sequelize from '../../db.js'; // Asegúrate de que la ruta sea correcta

const Inicio = sequelize.define('Inicio', {
    registroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Registros', // Nombre de la tabla de registros (debe coincidir con el nombre en la base de datos)
            key: 'id'
        }
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default Inicio;




