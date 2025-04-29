Entrega 1 y 2 - Programación Backend | José Luis Mancini

Proyecto del curso de Backend en Node.js y Express.

Servidor que permite gestionar productos y carritos, con persistencia en archivos .json, vista dinámica en tiempo real utilizando Handlebars y WebSocket (socket.io), y algunas mejoras extra para una mejor experiencia.

🚀 Funcionalidades

🔹 Productos (rutas /api/products)

GET / → Ver todos los productos

GET /:pid → Ver producto por ID

POST / → Agregar nuevo producto (con validaciones de datos)

PUT /:pid → Actualizar campos de un producto (excepto el ID)

DELETE /:pid → Eliminar producto por ID

🔹 Carritos (rutas /api/carts)

POST / → Crear un nuevo carrito

GET /:cid → Ver productos de un carrito

POST /:cid/product/:pid → Agregar producto a un carrito (si existe, aumenta quantity)

🎨 Vistas con Handlebars

🔸 /home

Lista de todos los productos cargados, generada con Handlebars.

🔸 /realtimeproducts

Vista en tiempo real que:

Actualiza automáticamente al agregar o eliminar productos

Tiene formulario para agregar productos nuevos

Tiene botón para eliminar productos

Muestra un contador dinámico de productos

Muestra alertas visuales cuando se actualiza la lista

🔌 WebSocket (socket.io)

Comunicación en tiempo real entre servidor y clientes conectados

Eventos personalizados:

nuevoProducto

eliminarProducto

productosActualizados

Actualización automática de la lista de productos en todos los navegadores abiertos

📦 Estructura del proyecto

src/
├── app.js
├── data/
│   ├── products.json
│   └── carts.json
├── managers/
│   ├── ProductManager.js
│   └── CartManager.js
├── routes/
│   ├── products.routes.js
│   ├── carts.routes.js
│   └── views.routes.js
views/
├── home.handlebars
└── realTimeProducts.handlebars
public/
└── (archivos estáticos opcionales como estilos o scripts)

⚙️ Cómo probar el proyecto

Clonar el repositorio:

git clone [URL-del-repo]

Instalar dependencias:

npm install

Ejecutar el servidor:

node src/app.js

Abrir en el navegador:

http://localhost:8080/home → Vista general

http://localhost:8080/realtimeproducts → Vista en tiempo real

Testear los endpoints con Postman:

/api/products

/api/carts

📌 Mejoras Extra Agregadas

Validación al agregar productos (campos obligatorios y code único)

Contador dinámico del total de productos

Alertas visuales de actualización

Código limpio, modular y extensible

📋 Notas

La persistencia de datos se realiza mediante el módulo fs en archivos .json.

La carpeta node_modules está correctamente ignorada usando .gitignore.

Proyecto diseñado bajo buenas prácticas de backend.

Desarrollado por José Luis Mancini ❤️