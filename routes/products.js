import { Router } from "express"
import Product from "../models/products.js"
import authMiddleware from "../middleware/addproduct.js"
import userMiddleware from "../middleware/user.js"
const router = Router()

router.get('/', async(req, res) => {
    const products = await Product.find({}).lean()

    res.render('index', {
        title: 'DevTutorials | Shop',
        products:products.reverse(),
        userId: req.userId ? req.userId.toString() : null,
    })
})

router.get('/products', async (req, res) => {
    const user = req.userId ? req.userId.toString() : null
    const myProducts = await Product.find({user}).populate('user').lean()

    console.log(myProducts)

    res.render('products', {
        title: 'Products | Shop',
        isProducts: true,
        myProducts: myProducts,
    })
})

router.get('/product/:id', async (req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('user').lean()

    res.render('product', {
        product: product
    })
})

router.get('/add', authMiddleware, (req, res) => {
    res.render('add', {
        title: 'Add Product | Shop',
        isAdd: true,
        createdError: req.flash('createdError')
    })
})

router.get('/edit-product/:id', async (req, res) => {
    const id = req.params.id
    const product = await Product.findById(id).populate('user').lean()

    res.render('edit-product', {
        title: 'Updated Product | Shop',
        product: product,
        updatedError: req.flash('updatedError'),
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


router.post('/edit-product/:id', async (req, res) => {
    const {title, description, image, price} = req.body
    const id = req.params.id

    if(!title | !description | !image | !price){
        req.flash('updatedError', 'All fields is required')
        res.redirect('/edit-product')
        return
    }
    
    await Product.findByIdAndUpdate(id, req.body, {new: true})
    
    res.redirect('/')
})

router.post('/delete-product/:id', async (req, res) => {
    const id = req.params.id
    await Product.findByIdAndRemove(id)

    res.redirect('/')
})

export default router