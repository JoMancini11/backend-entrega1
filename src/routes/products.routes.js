import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

router.get('/', (req, res) => {
  res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
  const product = productManager.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).send('Producto no encontrado');
});

router.post('/', (req, res) => {
  const result = productManager.addProduct(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});


router.put('/:pid', (req, res) => {
  const result = productManager.updateProduct(req.params.pid, req.body);
  result ? res.json(result) : res.status(404).send('Producto no encontrado');
});

router.delete('/:pid', (req, res) => {
  const result = productManager.deleteProduct(req.params.pid);
  result ? res.json({ mensaje: 'Producto eliminado' }) : res.status(404).send('Producto no encontrado');
});

export default router;
