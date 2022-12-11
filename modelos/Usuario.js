const { Schema, model } = require('mongoose');

//Se crea el modelo usuarios con los datos mínimos solicitados

const UsuarioSchema = Schema({
    nombre: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
    contrasena: { type: 'string', required: true },
    rol: { type: 'string', required: true, enum: ['ADMIN', 'DOCENTE'] }, 
    estado: { type: 'String', required: true, enum: ['Activo', 'Inactivo']},
    fechaCreacion: { type: Date, required: true, },
    fechaActualizacion: {  type: Date, required: true}
});

//Exportamos el modelo para que sea usado por otros módulos.
//Exporta un modelo que se llamará 'Usuario' y tendrá la estructura definida en la constante 'UsuarioSchema'

module.exports = model('Usuario', UsuarioSchema);


