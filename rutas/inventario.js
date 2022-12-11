const { Router } = require('express');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRolAdmin } = require('../middlewares/validar-admin');


const Inventario = require('../modelos/Inventario');
const Usuario = require('../modelos/Usuario');
const Marca = require('../modelos/Marca');
const TipoEquipo = require('../modelos/TipoEquipo');
const EstadoEquipo = require('../modelos/EstadoEquipo');

const router = Router();


// POST http://localhost:3000/inventario/guardar
router.post('/guardar', [validarJWT, validarRolAdmin], async function(req, res) {
    try {
        console.log(req.body);
        // select * from inventario; lista
        // select * from inventario where serial = ? limit 1
       let validarExistenciaInventario = await Inventario.findOne({ serial: req.body.serial });
       if (validarExistenciaInventario) {
           return res.status(400).send('El serial ingresado ya existe');
       }


      let inventario = new Inventario(); 
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.precio = req.body.precio;
        inventario.fechaCompra = new Date();
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date(); 
        
       // guardamos
       inventario = await inventario.save();
       res.send(inventario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrió un error en servidor');
    }
});

// GET http://localhost:3000/inventario 
router.get('/listar', async function (req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            { path: 'usuario', select: 'nombre email' },
            { path: 'marca', select: 'nombre estado' },
            { path: 'tipoEquipo', select: 'nombre estado' },
            { path: 'estadoEquipo', select: 'nombre estado' }
        ]); // []
        res.send(inventarios);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
    }
});


// PUT http://localhost:3000/inventario/editar/id
router.put('/editar/:inventarioId', [validarJWT, validarRolAdmin], async function(req, res) {
    try {
        console.log(req.body, req.params.inventarioId);
       
        let inventario = await Inventario.findById(req.params.inventarioId);
        if (!inventario) {
            return res.status(400).send('Inventario no existe');
        }
        
        // select * from inventario; lista
        // select * from inventario where serial = ? limit 1
       const invExisteXSerial = await Inventario.findOne({ serial: req.body.serial, _id: { $ne: inventario._id } });
       if (invExisteXSerial) {
           return res.status(400).send('Serial ya existe');
       }

       inventario.serial = req.body.serial;
       inventario.modelo = req.body.modelo;
       inventario.descripcion = req.body.descripcion;
       inventario.foto = req.body.foto;
       inventario.fechaCompra = new Date();
       inventario.precio = req.body.precio;
       inventario.usuario = req.body.usuario._id;
       inventario.marca = req.body.marca._id;
       inventario.tipoEquipo = req.body.tipoEquipo._id;
       inventario.estadoEquipo = req.body.estadoEquipo._id;
       inventario.fechaActualizacion = new Date();
       // guardamos
       inventario = await inventario.save();
       res.send(inventario);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

module.exports = router;