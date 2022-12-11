const {Router} = require ('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRolAdmin } = require('../middlewares/validar-admin');
const router = Router();
const EstadoEquipo = require('../modelos/EstadoEquipo');

// GET http://localhost:3000/equipoEquipo/listar
router.get('/listar', [validarJWT, validarRolAdmin],async function(req, res) {
    try {
        const estadoEquipo = await EstadoEquipo.find();
        res.send(estadoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});


// POST http://localhost:3000/estadoEquipo/guardar
router.post('/guardar', [validarJWT, validarRolAdmin], async function(req, res){

    try{
        console.log(req.body.nombre);
        
        let equipoEstado = new EstadoEquipo();
        equipoEstado.nombre = req.body.nombre;
        equipoEstado.estado = req.body.estado;
        equipoEstado.fechaCreacion = new Date();
        equipoEstado.fechaActualizacion = new Date();

        equipoEstado = await equipoEstado.save();

        res.send(equipoEstado);
    }catch(error){
        console.log(error)
        res.send('Ocurrio un error');
    }
});


// PUT http://localhost:3000/estadoEquipo/editar/id
router.put('/editar/:estadoEquipoId', [validarJWT, validarRolAdmin], async function(req, res){

    try{
        console.log('Objeto recibido', req.body, req.params.estadoEquipoId);

        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);

        if(!estadoEquipo){
            return res.send("El tipo de equipo ingresado no existe");
        }
        
        const existeEquipo = await EstadoEquipo.findOne({nombre: req.body.nombre, 
        _id: {$ne: estadoEquipo._id}});

        if(existeEquipo){
            return res.send('El nombre del tipo de equipo ingresado ya existe')
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = req.body.fechaCreacion;
        estadoEquipo.fechaActualizacion = new Date();
        // guardamos
        estadoEquipo = await estadoEquipo.save();
        res.send(estadoEquipo);
        } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
        }
});


module.exports = router;