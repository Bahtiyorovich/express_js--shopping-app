import { Router } from "express"
const router = Router()

router.get('/', (req, res) => {
    res.render('index', {
        title: 'DevTutorials | Shop'
    })
})

router.get('/add', (req, res) => {
    res.render('add', {
        title: 'Add Product | Shop',
        isAdd: true
    })
})

router.get('/products', (req, res) => {
    res.render('products', {
        title: 'Products | Shop',
        isProducts: true,
    })
})

export default router