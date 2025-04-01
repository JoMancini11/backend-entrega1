import fs from 'fs';
import ProductManager from './ProductManager.js';

const productManager = new ProductManager('./src/data/products.json');

export default class CartManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, '[]');
  }

  getCarts() {
    return JSON.parse(fs.readFileSync(this.path));
  }

  saveCarts(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
  }

  createCart() {
    const carts = this.getCarts();
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    this.saveCarts(carts);
    return newCart;
  }

  getCartById(cid) {
    return this.getCarts().find(c => c.id == cid);
  }

  addProductToCart(cid, pid) {
    const carts = this.getCarts();
    const cart = carts.find(c => c.id == cid);
    if (!cart) return null;

    const product = productManager.getProductById(pid);
    if (!product) return null;

    const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    this.saveCarts(carts);
    return cart;
  }
}
