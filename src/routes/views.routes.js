import { Router } from 'express';
import ProductModel from '../models/Product.model.js';
import CartModel from '../models/Cart.model.js';

const router = Router();

router.get('/home', async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await ProductModel.find().lean();
  res.render('realTimeProducts', { products });
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('carts', { cart });
  } catch (err) {
    res.status(500).send('Error al mostrar carrito');
  }
});

export default router;
