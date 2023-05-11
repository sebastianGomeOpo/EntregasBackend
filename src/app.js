// Importar express
import express from 'express';
import { productRouter } from './routers/products.router.js';
import { cartRouter } from './routers/cart.router.js'

const port = 8080;

// Creamos la aplicación de express que se encargará de manejar las peticiones HTTP a nuestro servidor 
const app = express();

// Middleware para poder obtener los datos que se envían desde el cliente al servidor 
app.use(express.json());

// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));

// express.static es un middleware que nos permite servir archivos estáticos como imágenes, archivos CSS, archivos JS, etc.
// Le indicamos a express que la carpeta public contiene archivos estáticos
app.use(express.static("public"));

// Definir las rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

