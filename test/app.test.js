// test/app.test.js
import request from 'supertest';
import app from '../proxy.js'; // Asegúrate de que la ruta sea correcta
 // Asegúrate de que la ruta sea correcta

describe('API Endpoints', () => {
    // Prueba para la ruta de registro
    describe('POST /api/registro', () => {
        it('debería registrar un nuevo usuario', async () => {
            const nuevoUsuario = {
                nombre: 'Juan',
                segundoNombre: 'Pérez',
                apellido: 'García',
                segundoApellido: 'López',
                email: 'juan.perez@example.com',
                fechaNacimiento: '1990-01-01',
                contrasena: 'contrasena123'
            };

            const response = await request(app)
                .post('/api/registro')
                .send(nuevoUsuario);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id'); // Asegúrate de que el ID se devuelva
        });
    });

    // Prueba para la ruta de inicio de sesión
    describe('POST /api/inicio', () => {
        it('debería iniciar sesión con credenciales válidas', async () => {
            const credenciales = {
                email: 'juan.perez@example.com',
                contrasena: 'contrasena123'
            };

            const response = await request(app)
                .post('/api/inicio')
                .send(credenciales);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Inicio de sesión exitoso');
        });

        it('debería devolver un error con credenciales inválidas', async () => {
            const credencialesInvalidas = {
                email: 'juan.perez@example.com',
                contrasena: 'contraseñaIncorrecta'
            };

            const response = await request(app)
                .post('/api/inicio')
                .send(credencialesInvalidas);

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Credenciales inválidas');
        });
    });

    // Prueba para la ruta de clasificación
    describe('GET /api/clasificacion', () => {
        it('debería obtener todas las clasificaciones', async () => {
            const response = await request(app).get('/api/clasificacion');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true); // Verifica que sea un array
        });
    });
});
