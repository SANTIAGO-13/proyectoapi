import { DataTypes } from 'sequelize';
import sequelize from '../../db.js';

const Pais = sequelize.define('Pais', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bandera: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Pais;



