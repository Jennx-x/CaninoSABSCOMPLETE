# Proyecto API - Gestión de Productos, Usuarios, Roles y Compañías

## Descripción

Este proyecto consiste en una API RESTful construida con Node.js, Express y Sequelize para gestionar productos, usuarios, roles, compañías y categorías. La API permite realizar operaciones CRUD en los diferentes módulos y autenticar usuarios mediante JWT.

---

## 🛠 Dependencias

Este proyecto requiere las siguientes dependencias:

### 1. **Express**

- Framework web para Node.js.
- Instala con:
  ```bash
  npm install express
  ```

### 2. **Sequelize**

- ORM para Node.js que soporta bases de datos SQL.
- Instala con:
  ```bash
  npm install sequelize
  ```

### 3. **Sequelize CLI**

- Herramienta de línea de comandos para gestionar bases de datos y migraciones.
- Instala con:
  ```bash
  npm install --save-dev sequelize-cli
  ```

### 4. **MySQL2**

- Paquete necesario para la conexión con bases de datos MySQL.
- Instala con:
  ```bash
  npm install mysql2
  ```

### 5. **dotenv**

- Para cargar variables de entorno desde un archivo `.env`.
- Instala con:
  ```bash
  npm install dotenv
  ```

### 6. **cors**

- Middleware para habilitar CORS (Cross-Origin Resource Sharing).
- Instala con:
  ```bash
  npm install cors
  ```

### 7. **jsonwebtoken**

- Librería para generar y verificar JSON Web Tokens (JWT).
- Instala con:
  ```bash
  npm install jsonwebtoken
  ```

### 8. **bcryptjs**

- Para encriptar contraseñas.
- Instala con:
  ```bash
  npm install bcryptjs
  ```

---

## 🚀 Configuración

1. **Archivo `.env`**: Crea un archivo `.env` en la raíz del proyecto para almacenar tus variables de entorno. Aquí tienes un ejemplo de contenido para el archivo:

```env
# Configuraciones de la base de datos
DB_NAME=(Nombre de la base de datos)
DB_USER=root
DB_PASSWORD=(contraseña del gestor de bases de datos)
DB_HOST=localhost
DB_PORT=3306

PORT=3030
JWT_SECRET=gfbj4u5gdfvd87v8d7vdfvdfvhb8tuvidfvb_isdvh834bv

```


### Ejecuta la aplicación
npm start