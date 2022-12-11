const validarRolAdmin = (req, res, next) => {
    if (req.payload.rol !== 'ADMIN') { 
        res.status(401).json({ message: 'Error, usuario no autorizado' });
    } 
    next();
}

module.exports = {
    validarRolAdmin
}