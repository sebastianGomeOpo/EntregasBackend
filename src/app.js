//import productManager from 'productManager.js';
// Importar express
import express from 'express';

import productManager from "./productManager.js";

const pm = new productManager("productos.json");

const test = async () => {
    try{
        await pm.addProduct('zapatilla', 'zapatilla de lujo', 300, 'Sin imagen', '123-R', 15);
        await pm.addProduct('zapatilla2', 'zapatilla de lujo2', 200, 'Sin imagen2', '123-R2', 12);
        await pm.addProduct('Buzo', 'Buzos escolares', 400, 'Sin imagen2', '123-R3', 13);
        await pm.addProduct('Polo', 'Polos escolares', 500, 'Sin imagen2', '123-R4', 14);
        await pm.addProduct('Short', 'Shorts Escolares', 600, 'Sin imagen2', '123-R5', 16);
    }catch(err){
        console.log(err.message)
    }
    
}

//test();

const app = express();
const port = 8080;

// Utilizamos el middleware para parsear los datos de la petición
app.use(express.urlencoded({ extended: true }));


// Definir las rutas

app.get('/products', async (req, res) => {
  // Obtener el parámetro limit de la query
  // definir variable limit, si no viene en la query, usar 10
  const limit = req.query.limit || 10;
  // Obtener los productos , usando getProductos de productManager; se pone como await porque es una promesa
  const products = await pm.getProducts();
  // Enviar los productos como respuesta, usando res.send
  // products.slice sirve para cortar el arreglo de productos, desde el 0 hasta el límite
  res.send(products.slice(0, limit));
});


app.get('/products/:id', async (req, res) => {
  // Obtener el id de los parámetros de la ruta; usando req.params (es un objeto) y el nombre del parámetro (id) como clave del objeto 
  const id = Number(req.params.id);
  // Obtener el producto por id, usando getProductById de productManager
  try {
    const product = await pm.getProductById(id);
    res.send(product);
  } catch (err) {
    res.status(404).send({ error: 'Producto no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

