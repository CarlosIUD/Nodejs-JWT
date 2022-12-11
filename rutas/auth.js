const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const Usuario = require('../modelos/Usuario');
const {generarJWT } = require('../helpers/jwt');
const router = Router();

router.post('/', [check('email', 'email.requerido').isEmail(),
check('contrasena', 'contrasena.requerida').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req); 
        if (!errors.isEmpty()) { 
            return res.status(400).json({ mensaje: errors.array() });
        }
        // Validamos si existen usuarios por email
        const usuario = await Usuario.findOne({ email: req.body.email }); 
        if (!usuario) { 
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }
        //validación por medio de la contraseña
        const contrasenaIgual = bycript.compareSync(req.body.contrasena, usuario.contrasena);
        if (!contrasenaIgual) { 
            return res.status(400).json({ mensaje: 'Usuario no encontrado' });
        }
            //Se genera el token para el usuario
        const token = generarJWT(usuario);

        res.json({ _id: usuario._id, nombre: usuario.nombre, rol: usuario.rol, email: usuario.email, access_token: token });

    } catch (error) {
        console.log(error); 
        res.status(500).json({ mensaje: 'Internal server error' });
    }
});

module.exports = router;