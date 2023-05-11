import fs from 'fs';




class cartManager {
    #id = 0;

    constructor(path) {
        this.path = path;
        // Verifica si el archivo existe, si no existe lo crea, si existe lo lee  
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }


    async getCart(cid) {
        const carts = JSON.parse(readFileSync(cartFile));
        return carts.find(cart => cart.id === cid);
    }

    async addCart() {
        const carts = JSON.parse(readFileSync(cartFile));
        const newCart = {
            id: carts.length + 1,
            products: [],
        };
        carts.push(newCart);
        writeFileSync(cartFile, JSON.stringify(carts));
        return newCart;
    }

    async addProduct(cid, pid) {
        const carts = JSON.parse(readFileSync(cartFile));
        const cart = carts.find(cart => cart.id === cid);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = cart.products.find(product => product.product === pid);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        writeFileSync(cartFile, JSON.stringify(carts));
        return cart;
    }
}

export default cartManager;
