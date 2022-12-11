const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
                        //para errores de autorización (de login) se manejan con el código 401
        return res.status(401).json({ mensaje: 'Error, no estás autorizado' });
    }

    try { 
        const payload = jwt.verify(token, 'abcd123');
        req.payload = payload;
        next();
    } catch (error) { 
        console.log(error);
        return res.status(401).json({ mensaje: 'Error, no estás autorizado' });
    }
}

module.exports = {
    validarJWT
}