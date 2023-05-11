import fs from 'fs';


class productManager {
    //Definimos el atributo privado `#id` que es un numero que se va a utilizar para generar el id de los products
    #id=0;
    //Definimos el constructor de la clase `productManager`, recibe como parametro un ruta de un archivo json
    // El constructor es un metodo especial que se ejecuta automaticante cuando se crea una instancia de la clase
    // Es decir que cuando se crea un objeto de la clase productManager, se ejecuta el constructor
    // Por ejemplo: `let productManager = new productManager();` nos devolvera   `productManager {products: Array(0)}`
    constructor(path) {
        this.path = path;
        // Verifica si el archivo existe, si no existe lo crea, si existe lo lee  
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    // definimos getProducts como un metodo asincronico que devuelve la lista de products registrados en el objeto `productManager`
    async getProducts(){
        // Se lee el archivo para obtener los productos actuales, desde la ruta en this.path
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products)
        }catch(err){
            console.log('No puedo darte productos');
        }
    }
    // La funcion en un metodo de la clase; que devuelve la lista de products registrados en el objeto `productManager`.Esta funcion se llama `getProducts`
    // La funcion `getProducts` devuelve el atributo `products` de la clase `productManager`
    // Por ejemplo: `productManager.getProducts()` nos devolvera `[]`
    // 
    
    // Documentacion de la funcion `addProduct`
    /**
	 * Permite agregar un product a la lista de products
	 * @param {string} title title del product
	 * @param {string}   del product
	 * @param {number} price price del product
	 * @param {string} thumbnail product
	 * @param {Date} fecha Fecha del product
	 */

    async addProduct(title, description, price, thumbnail, code, stock){
        // Se lee el archivo para obtener los productos actuales
        const products = await this.getProducts();
        // Creamos un objeto de tipo product
        const product = {
            // El atributo id se genera automaticamente con el valor del atributo privado `#id` y se incrementa en 1
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        // Agregamos el ID al product
        product.id = this.#getID(); // Otra forma de agregar el id al product
        
        // Validamos que el codigo no este repetido
        if (await this.isCodeRepeated(code)) {
            throw new Error('El codigo del producto ya existe');
        }
        
        // Agregamos el product al arreglo de products
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products), (err) => {
            if (err) {
                throw new Error('Error al guardar el archivo');
            }
        });
        return product;
    };

    // Metodo privado que incrementa en 1 el valor de ID y lo retorna
	// permite evitar id repetidos
	// Es privado para que nadie pueda utilizarlo y afectar la correlatividad de los id
	#getID() {
		// Incremento en 1 el valor de id
		this.#id++; // Otra forma de incrementar el id
		return this.#id;
	};

    
    //getProductById(id) , que devuelve el product con el id pasado por parámetro. Si no existe, debe devolver un error.
    async getProductById(id) {
        // Buscamos el product con el id pasado por parametro
        const products = await this.getProducts();
        // Si no existe, devolvemos un error
        const product = products.find((p) => p.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        // Si existe, devolvemos el product
        return product;
    }

    // isCodeRepeated(code) , que devuelve true si el código pasado por parámetro ya existe en el arreglo de products, false en caso contrario.
    async isCodeRepeated(code) {
        // Leemos el archivo para obtener los productos actuales
        const currentProducts = await this.getProducts();
    
        // Buscamos si existe un producto con el código pasado por parámetro
        return currentProducts.some((p) => p.code === code);
    } 

    // updateProduct recibe como parametro id del product a actualizar y un objeto con los campos a actualizar
    async updateProduct(id, updates) {
        // Se lee el archivo para obtener los productos actuales
        const products = await this.getProducts();
        // Se busca el producto con el id especificado ; deuvelve 0 por que la posicion en la que se encuentra el producto con id 1 es 0
        const productIndex = products.findIndex((p) => p.id === id);
        // Si no se encontró el producto, se lanza un error
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }
        // Se valida que no se elimine el id del producto
        if (updates.id && updates.id !== id) {
            throw new Error('No se puede cambiar el id del producto');
        }
        // Se valida que no se repita el código del producto
        if (await this.isCodeRepeated(updates.id)) {
            throw new Error('El código del producto ya existe');
        }
        // Se actualiza el producto con los valores especificados
        // console.log({...products[0]});
        // console.log({...updates});
        const updatedProduct = { ...products[productIndex], ...updates };
        // console.log(updatedProduct);
        //console.log(updatedProduct);

        // Se reemplaza el producto actualizado en el arreglo de productos
        products.splice(productIndex, 1, updatedProduct);
        // Se guarda el arreglo actualizado en el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(products), (err) => {
            if (err) {
                throw new Error('Error al guardar el archivo');
            }
        });
        // Se verifica que se haya realizado la actualización
        const updatedProducts = await this.getProducts;
        const updatedProductIndex = updatedProducts.findIndex((p) => p.id === id);
        const isUpdated = JSON.stringify(updatedProducts[updatedProductIndex]) === JSON.stringify(updatedProduct);
        if (!isUpdated) {
            throw new Error('Error al actualizar el producto');
        }
    }


    async  deleteProduct(id) {
        // Se lee el archivo para obtener los productos actuales
        const products = await this.getProducts();
        // Se busca el producto con el id especificado
        const productIndex = products.findIndex((p) => p.id === id);
        // Si no se encontró el producto, se lanza un error
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }
        // Se elimina el producto del arreglo de productos
        products.splice(productIndex, 1);
        // Se guarda el arreglo actualizado en el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }
} 


// ************** Pruebas *************
// Crear instancia de ProductManager
// const pm = new productManager("productosXD.json");


// Obtener productos (debe devolver arreglo vacío)
// 

// Agregar producto
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

const updateador = async () => {
    try{
        await pm.updateProduct(1,{"title":"zapatillaXD","description":"zapatilla de lujoXD","thumbnail":"Sin imagen","code":"123-R","stock":15,"participantes":[],"id":1});
    }catch(err){
        console.log(err)
    }
};

//updateador();

const deleteador = async ()=>{
    try {
        await pm.deleteProduct(1);
    } catch (error) {
        console.log(error);
    }
}

//deleteador()

// Agregar producto con código repetido (debe arrojar un error)

// try {
//   pm.addProduct('zapatilla', 'zapatilla de lujo', 300, 'Sin imagen', '123-R', 15);
// } catch (error) {
//   console.log(error.message); // 
// }

// // Obtener producto por id (debe devolver el producto)
// //console.log(pm.getProductById('random-id')); 
// // Obtener producto por id inexistente (debe arrojar un error)
// try {
//   pm.getProductById('non-existent-id');
// } catch (error) {
//   console.log(error.message); // 
// }

export default productManager;


