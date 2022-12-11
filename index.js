const express = require('express');
const { getConnection } = require('./db/db-connection-mongo');
const cors = require('cors');
const AuthRoute = require('./rutas/auth');
const app = express();

//Middleware que permitirá el ingreso desde orígenes remotos 
app.use(cors());

// lectura o parseo de json
app.use(express.json());


getConnection();

const inventario = require('./rutas/inventario');
const usuario = require('./rutas/usuario');
const marca = require('./rutas/marca');
const tipoEquipo = require('./rutas/tipoEquipo');
const estadoEquipo = require('./rutas/estadoEquipo');


app.use('/login', AuthRoute);  // http://localhost:3000/login
app.use('/usuario', usuario); // http://localhost:3000/usuario GET, POST, PUT
app.use('/marca', marca); // http://localhost:3000/usuario GET, POST, PUT
app.use('/tipoEquipo', tipoEquipo); // http://localhost:3000/tipoEquipo GET, POST, PUT
app.use('/inventario', inventario); // http://localhost:3000/inventario GET, POST, PUT
app.use('/estadoEquipo', estadoEquipo); // http://localhost:3000/estadoEquipo GET, POST, PUT


//Levantar el servidor express
app.listen(3000, function() {
    console.log('Aplicación corriendo en el puerto 3000');
});


