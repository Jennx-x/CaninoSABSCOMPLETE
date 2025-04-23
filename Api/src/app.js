require('dotenv').config()
const express = require('express')
var cors = require('cors')
const app = express()
const sequalize = require('./config/db')

const port = process.env.PORT;
app.use(express.json());

app.use(cors())

// Modelos del proyecto
const Product = require('./models/products.models')
const Company = require('./models/company.models')
const Role = require('./models/roles.models')
const User = require('./models/users.models')
const Category = require('./models/category.models')

// Sincroización con la base de datos 
sequalize.sync()


// Rutas del proyecto
app.get('/', (req, res) => {res.json({"saludo":'Hello World!'})})


// Company:
const routeCompany = require('./routers/company.routers');
app.use('/companies', routeCompany);
// Roles:
const routeRoles = require('./routers/roles.routers');
app.use('/roles', routeRoles);
// Users:
const routeUsers = require('./routers/users.routers');
app.use('/users', routeUsers);
// Login:
const loginRouter = require('./routers/login.routers');
app.use('/login', loginRouter);
// Categories
const routeCategory = require('./routers/category.routers');
app.use('/categories', routeCategory);
// Products
const routeProduct = require('./routers/products.routers');
app.use('/products',routeProduct)

// Ejecución del servidor
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})