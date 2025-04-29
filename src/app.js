import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import ProductManager from './managers/ProductManager.js';

// Configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Crear servidor HTTP + WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer);

// Instancia del ProductManager
const productManager = new ProductManager();

// WebSocket events
io.on('connection', socket => {
  console.log('Cliente conectado vía WebSocket');

  socket.on('nuevoProducto', data => {
    const resultado = productManager.addProduct(data);
    if (!resultado.error) {
      const productos = productManager.getProducts();
      io.emit('productosActualizados', productos);
    } else {
      socket.emit('errorProducto', resultado.error);
    }
  });

  socket.on('eliminarProducto', id => {
    productManager.deleteProduct(id);
    const productos = productManager.getProducts();
    io.emit('productosActualizados', productos);
  });
});

// Exponer socket desde app si se necesitara en otras partes
app.set('socketio', io);

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
