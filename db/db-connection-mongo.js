const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        const url = 'mongodb://admin:IUD1036402361@ac-zxuhuqx-shard-00-00.6fdxfy4.mongodb.net:27017,ac-zxuhuqx-shard-00-01.6fdxfy4.mongodb.net:27017,ac-zxuhuqx-shard-00-02.6fdxfy4.mongodb.net:27017/dss-app?ssl=true&replicaSet=atlas-yy23pm-shard-0&authSource=admin&retryWrites=true&w=majority';

        await mongoose.connect(url);
        console.log('Conexión exitosa a la base de datos :D');

    } catch (error) {
        console.log(error);
        throw new Error('No se puede conectar a la base de datos')
    }
}

module.exports = {
    getConnection: getConnection
}