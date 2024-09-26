// db.js
import { Sequelize } from 'sequelize';

// Configuración de conexión a MySQL
const sequelize = new Sequelize('apifutbol', 'root', 'Santiago1309', { 
    host: 'localhost',
    dialect: 'mysql',
});

// Verificación de la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión establecida correctamente con la base de datos.');
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos:', error);
    });

export default sequelize;


