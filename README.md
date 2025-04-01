# Entrega 1 -  Programacion Backend | Jose Luis Mancini

Proyecto del curso de Backend en Node.js y Express.

Servidor que permite gestionar productos y carritos, con persistencia en archivos `.json`.

## Funcionalidades

🔹 Productos  
- Ver todos  
- Ver por ID  
- Agregar  
- Actualizar (menos el ID)  
- Eliminar

🔹 Carritos  
- Crear carrito  
- Ver productos de un carrito  
- Agregar producto (si ya existe, aumenta el quantity)

## Estructura

src/ 
├── app.js 
── data/
        ├── products.json 
        └── carts.json 
├── managers/ 
             ├── ProductManager.js 
             └── CartManager.js 
└── routes/ 
          ├── products.routes.js 
          └── carts.routes.js

          
## Cómo probar

Usar Postman para testear los endpoints (`/api/products` y `/api/carts`).  
El servidor corre en el puerto `8080`.

## Notas

- Se usa el módulo `fs` para guardar datos.  
- Se ignora la carpeta `node_modules` con `.gitignore`.

---

José Luis Mancini <3
