import multer from "multer";


// Definimos imgStore para guardar las imagenes en la carpeta public/img
// La instancia multer.diskStorage sirve para configurar como se guardan los archivos que se encargan en el servidor
// multer.diskStorage recibe un objeto con dos funciones: destination y filename
const storage = multer.diskStorage({
    // destination sirve para definir la carpeta donde se guardan los archivos
    destination: (req, file, cb) => {
        // cb sirve para devolver el nombre de la carpeta donde se guardan los archivos
        // El primer parámetro debe ser null y el segundo parámetro debe ser la ruta de la carpeta
        cb(null, "public/img");
    },

    // filename sirve para definir el nombre del archivo, en este caso se usa el nombre original del archivo
    filename: (req, file, cb) => {
        const date= new Date();
        // cb sirve para devolver el nombre del archivo, en este caso se usa el nombre original del archivo
        // cb es un callback que recibe dos parametros: error y nombre del archivo
        // En este caso no se usa error, por lo que se pone null
        cb(null,`${date.getTime()}-${req.body.code}-${req.body.title}.png`);
    },

});


export const imgUploader = multer({ storage});
