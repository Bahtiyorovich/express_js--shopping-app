import { Router } from "express"
import Product from "../models/products.js"
import authMiddleware from "../middleware/addproduct.js"
import userMiddleware from "../middleware/user.js"
const router = Router()

router.get('/', async(req, res) => {
    const products = await Product.find({}).lean()
    // console.log(products)
    res.render('index', {
        title: 'DevTutorials | Shop',
        products:products.reverse()
    })
})


router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products | Shop',
        isProducts: true,
    })
})

router.get('/add', authMiddleware, (req, res) => {
    
    res.render('add', {
        title: 'Add Product | Shop',
        isAdd: true,
        createdError: req.flash('createdError')
    })
})

router.post('/add-products',userMiddleware ,async (req, res) => {
    const {title, description, image,  price } = req.body
    if(!title || !description || !image || !price){
        req.flash('createdError', 'All fields is required')
        res.redirect('/add')
        return
    }

    await Product.create({...req.body, user:req.userId})

    res.redirect('/')
})

export default router