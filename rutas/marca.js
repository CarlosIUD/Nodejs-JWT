const {Router} = require ('express');
const router = Router();
const Marca = require('../modelos/Marca');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarRolAdmin } = require('../middlewares/validar-admin');



// POST http://localhost:3000/marca/guardar
router.post('/guardar', [validarJWT, validarRolAdmin], async function(req, res){

    try{
        console.log(req.body);
        
        const validarExistenciaMarca = await Marca.findOne({nombre: req.body.nombre});
        
        if(validarExistenciaMarca){
            return res.send('La marca ingresada ya existe');
        }


        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();

        res.send(marca);
    }catch(error){
        console.log(error)
        res.send('Ocurrio un error');
    }

    
    
});

// GET http://localhost:3000/marca/listar
router.get('/listar', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const marcas = await Marca.find();
        res.send(marcas);
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
    }
});

// PUT http://localhost:3000/marca/editar/id
router.put('/editar/:marcaId', [validarJWT, validarRolAdmin], async function(req, res){

    try{
        console.log('Objeto recibido', req.body, req.params.marcaId);

        let marca = await Marca.findById(req.params.marcaId);

        if(!marca){
            return res.send("La marca ingresado no existe");
        }
        
        const existeMarca = await Marca.findOne({nombre: req.body.nombre, 
        _id: {$ne: marca._id}});

        if(existeMarca){
            return res.send('El nombre de la marca ingresada ya existe')
        }

        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = req.body.fechaCreacion;
        marca.fechaActualizacion = new Date();
        // guardamos
        marca = await marca.save();
        res.send(marca);
        } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
        }
});

module.exports = router;