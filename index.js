import  express  from "express";
import AuthRoutes from './routes/auth.js'
import mongoose from "mongoose";
import flash from 'connect-flash'
import session from "express-session";
import * as dotenv from 'dotenv' 



// ROUTES
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

// Midleware Routes
app.use(AuthRoutes)
app.use(ProductsRoutes)
app.use(express.json())

// Errorlarni validatsiya qilish kodlari 
// app.use(express.cookieParser('keyboard cat'));
app.use(session({secret:"webdev", resave: false, saveUninitialized: false}));
app.use(flash());


// loyiha nechinchi portda tinglanishini belgilash, "ishga tushirish"
// console.log(process.env.MONGO_URI)

const startApp = () => {
    try{
        mongoose.set('strictQuery', false)
        mongoose.connect(
            process.env.MONGO_URI, 
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

