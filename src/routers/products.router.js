import {Router} from "express";
import { imgUploader } from "../configs/uploadingImg.js";
import productManager from "../productManager.js";

// Creamos el router, que se encargará de manejar las rutas de products y sus peticiones HTTP
// productRouter sirve para manejar las rutas, por lo que todas las rutas que definamos en este router, comenzarán con /products
const productRouter = Router();

const pm = new productManager("productos.json");



// Ruta raíz GET para listar todos los productos
productRouter.get('/', async (req, res) => {
  // Obtener el parámetro limit de la query
  // definir variable limit, si no viene en la query, usar 10
    const limit = req.query.limit || 10;
  // Obtener los productos , usando getProductos de productManager; se pone como await porque es una promesa
    const products = await pm.getProducts();
  // Enviar los productos como respuesta, usando res.send
  // products.slice sirve para cortar el arreglo de productos, desde el 0 hasta el límite
    res.send(products.slice(0, limit));
});

// Ruta GET para obtener un producto por su id
productRouter.get('/:pid', async (req, res) => {
    // Obtener el id de los parámetros de la ruta; usando req.params (es un objeto) y el nombre del parámetro (id) como clave del objeto 
    const id = Number(req.params.pid);
  // Obtener el producto por id, usando getProductById de productManager
    try {
    const product = await pm.getProductById(id);
    res.send(product);
    } catch (err) {
    res.status(404).send({ error: 'Producto no encontrado' });
    }
});


// Ruta POST para guardar un producto
productRouter.post("/", imgUploader.array("thumbnail"), async (req, res) => {
  try {
      const body = req.body;
      // thumbnail = req.file.filename;

      // Guardar el producto, usando addProduct de productManager
      const product = await pm.addProduct(
          body.title,
          body.description,
          body.price,
          body.code,
          body.stock,
          // thumbnail,
      );
      // Enviar el producto como respuesta
      res.status(201).send(product);
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// Ruta PUT para actualizar un producto por su id
productRouter.put('/:pid', imgUploader.array("thumbnail"), async (req, res) => {
    // Obtener el id de los parámetros de la ruta; usando req.params (es un objeto) y el nombre del parámetro (id) como clave del objeto
    const id = Number(req.params.pid);
    // Obtener el body de la petición, usando req.body
    const body = req.body;
    // Obtener el archivo de la petición, usando req.file
    const file = req.file;
    // Actualizar el producto por id, usando updateProduct de productManager
    const product = await pm.updateProduct(id, {...body, thumbnail: file?.filename});
    // Enviar el producto como respuesta, usando res.send
    res.send(product);
});


// Ruta DELETE para eliminar un producto por su id
productRouter.delete('/:pid', async (req, res) => {
    // Obtener el id de los parámetros de la ruta; usando req.params (es un objeto) y el nombre del parámetro (pid) como clave del objeto
    const id = Number(req.params.pid);
    // Eliminar el producto por id, usando deleteProduct de productManager
    const product = await pm.deleteProduct(id);
    // Enviar el producto como respuesta, usando res.send
    res.send(product);
});

export {productRouter}


