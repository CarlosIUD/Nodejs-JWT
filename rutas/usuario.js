const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const Usuario = require('../modelos/Usuario');
const bycript = require('bcryptjs');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRolAdmin} = require('../middlewares/validar-admin');

const router = Router();


// POST http://localhost:3000/usuario/guardar

    // Creación de un nuevo usuario mediante el método post
    router.post('/guardar', [
        check('nombre', 'invalid.nombre').not().isEmpty(),
        check('email', 'invalid.email').isEmail(),
        check('rol', 'invalid.rol').isIn(['ADMIN', 'DOCENTE']),
        check('contrasena', 'invalid.contrasena').not().isEmpty(),
        validarJWT,
        validarRolAdmin

    ], async function (req, res) {
        try {
            console.log(req.body);

            //VALIDACIÓN DE CAMPOS REQUERIDOS
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ mensaje: errors.array() });
            }

            //VALIDACIÓN PARA QUE NO SE REPITAN EMAILS
            const emailRepetido = await Usuario.findOne({ email: req.body.email });
            if (emailRepetido) {
                return res.status(400).json({ mensaje: 'El email ya existe en la base de datos' });
            }

            let usuario = new Usuario();
            usuario.nombre = req.body.nombre;
            usuario.email = req.body.email;
            usuario.rol = req.body.rol;

            //Encriptar contraseña
            const salt = bycript.genSaltSync();
            const contrasena = bycript.hashSync(req.body.contrasena, salt);
            usuario.contrasena = contrasena;

            usuario.estado = req.body.estado; 
            usuario.fechaCreacion = new Date();
            usuario.fechaActualizacion = new Date();
            
            

            usuario = await usuario.save();

            res.send(usuario);

        } catch (error) {
            console.log(error);
            res.status(500).json({ mensaje: 'Internal server error' });
        }
    });

// GET http://localhost:3000/usuario/listar
router.get('/listar', [validarJWT,
    validarRolAdmin], async function (req, res) {
        try {
            const usuarios = await Usuario.find();
            res.send(usuarios);
        } catch (error) {
            console.log(error);
            res.status(500).send('Ocurrió un error en servidor');
        }
    });

// PUT http://localhost:3000/usuario/editar/id
router.put('/editar/:usuarioId',[validarJWT, validarRolAdmin], async function(req, res){

    try{
        console.log('Objeto recibido', req.body, req.params.usuarioId);

        let usuario = await Usuario.findById(req.params.usuarioId);

        if(!usuario){
            return res.send("El usuario ingresado no existe");
        }
        
        const existeUsuario = await Usuario.findOne({email: req.body.email, 
        _id: {$ne: usuario._id}});

        if(existeUsuario){
            return res.send('El email del usuario ingresado ya existe')
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.contrasena = req.body.contrasena;
        usuario.rol = req.body.rol;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = req.body.fechaCreacion;
        usuario.fechaActualizacion = new Date();
        // guardamos
        usuario = await usuario.save();
        res.send(usuario);
        } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error en servidor');
        }
});

module.exports = router;