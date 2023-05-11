import {Router} from 'express';
import  cartManager  from '../cartManager.js';

const cartRouter = Router();
const cm = new cartManager("carrito.json");

cartRouter.post("/", async (req, res) => {
    try {
        const newCart = await cm.addCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

cartRouter.get("/:cid", async (req, res) => {
    try {
        const cart = await cm.getCart(Number(req.params.cid));
        if (!cart) {
            res.status(404).send('Cart not found');
        } else {
            res.send(cart);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cart = await cm.addProduct(Number(req.params.cid), Number(req.params.pid));
        res.send(cart);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export  {cartRouter};
