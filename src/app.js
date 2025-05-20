import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import ProductModel from './models/Product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

mongoose.connect('mongodb://127.0.0.1:27017/coderbackend', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', async socket => {
  console.log('🟢 Cliente conectado vía WebSocket');

  socket.on('nuevoProducto', async data => {
    try {
      const nuevo = await ProductModel.create(data);
      const productosActualizados = await ProductModel.find().lean();
      io.emit('productosActualizados', productosActualizados);
    } catch (error) {
      console.error('❌ Error al agregar producto por WebSocket:', error.message);
      socket.emit('errorProducto', error.message);
    }
  });

  socket.on('eliminarProducto', async id => {
    try {
      await ProductModel.findByIdAndDelete(id);
      const productosActualizados = await ProductModel.find().lean();
      io.emit('productosActualizados', productosActualizados);
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error.message);
    }
  });
});

app.set('socketio', io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
