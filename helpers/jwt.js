const jwt = require('jsonwebtoken');

const generarJWT = (usuario) => { 
    const payload = { _id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
    const token = jwt.sign(payload, 'abcd123', { expiresIn: '10h' });
    return token;
}

module.exports = {
    generarJWT
}