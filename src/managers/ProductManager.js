import fs from 'fs';

export default class ProductManager {
  constructor(path = './src/data/products.json') {
    this.path = path;
    if (!fs.existsSync(this.path)) fs.writeFileSync(this.path, '[]');
  }

  getProducts() {
    return JSON.parse(fs.readFileSync(this.path));
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id == id);
  }

  addProduct(product) {
    const products = this.getProducts();

    // Validación básica
    if (!product.title || !product.description || !product.price || !product.code) {
      return { error: 'Faltan campos obligatorios: title, description, price o code' };
    }

    // Validar código único
    if (products.some(p => p.code === product.code)) {
      return { error: 'Ya existe un producto con ese código' };
    }

    const id = Date.now().toString();
    const newProduct = { id, ...product };
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  updateProduct(id, data) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data, id: products[index].id };
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products.splice(index, 1);
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    return true;
  }
}
