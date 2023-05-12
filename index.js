import  express  from "express";
import mongoose from "mongoose";
import flash from 'connect-flash'
import session from "express-session";
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv' 

// const MONGODB_URL = 'mongodb+srv://sherzodjon0317:4cjXNpc3X4PtYZbZ@cluster0.m573t0d.mongodb.net/?retryWrites=true&w=majority'


// ROUTES
import varMiddleware from './middleware/var.js'
import AuthRoutes from './routes/auth.js'
import ProductsRoutes from './routes/products.js'
import {engine, create} from 'express-handlebars'

// import path, {dirname} from 'path'
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// express.js ni ishlatishdan oldin uni bir o'zgaruvchiga biriktirib olish kerak.
dotenv.config()

const app = express()

const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs'
})

// quyidagi kodlar express.js ning dvijoklaridan biri handlebarsni ustanovka qilish kodlari
// bu kodlarning vazifasi html filega ma'lumotlarni dinamik berishni ta'minlaydi.
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

// auth user method
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
// session va flash ni AuthRoutes va ProductsRoutes dan oldin chaqirish kerak
app.use(session({secret:"expressmyapp", resave: false, saveUninitialized: false}));
app.use(flash());

// Midleware Routes
app.use(varMiddleware)
app.use(AuthRoutes)
app.use(ProductsRoutes)

// Errorlarni validatsiya qilish kodlari 
// app.use(express.cookieParser('keyboard cat'));


// loyiha nechinchi portda tinglanishini belgilash, "ishga tushirish"
// console.log(process.env.MONGO_URI)

const startApp = () => {
    try{
        mongoose.set('strictQuery', false)
        mongoose.connect(
            process.env.MONGODB_URL, 
            {
                useNewUrlParser: true,
                useUnifiedTopology:true
            },
        ).then(() => console.log('Connected Successfully'))
        .catch((err) => console.log(err))
        
        const PORT = process.env.PORT || 4100
        app.listen(PORT, () => console.log(`Project's port listening... ${PORT}`))
    } catch(error){
        console.log(error)
    }
}

startApp()
//connect mongodb to nodejs

