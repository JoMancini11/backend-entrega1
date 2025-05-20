import { Router } from 'express';
import CartModel from '../models/Cart.model.js';

const router = Router();

router.get('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear carrito', error });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true }
    );
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar carrito', error });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productInCart = cart.products.find(p => p.product.toString() === req.params.pid);
    if (productInCart) {
      productInCart.quantity = req.body.quantity;
    } else {
      cart.products.push({ product: req.params.pid, quantity: req.body.quantity });
    }

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad', error });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    res.json({ status: 'success', message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto', error });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();
    res.json({ status: 'success', message: 'Carrito vaciado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al vaciar carrito', error });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productId = req.params.pid;
    const productInCart = cart.products.find(p => p.product.toString() === productId);

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(201).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito', error });
  }
});

export default router;
