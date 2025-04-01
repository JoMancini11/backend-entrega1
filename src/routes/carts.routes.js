import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

router.post('/', (req, res) => {
  const cart = cartManager.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', (req, res) => {
  const cart = cartManager.getCartById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).send('Carrito no encontrado');
});

router.post('/:cid/product/:pid', (req, res) => {
  const result = cartManager.addProductToCart(req.params.cid, req.params.pid);
  result ? res.json(result) : res.status(404).send('Carrito o producto inválido');
});

export default router;
