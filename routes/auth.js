import { Router } from "express";
import User from '../models/user.js'

// passwordni hash qilish uchun kutubxona
import bcrypt from 'bcrypt'


const router = Router()

router.get('/login', (req, res) => {
   res.render('login', {
        title: 'Login | Shop',
        isLogin: true,
        loginError: req.flash("loginError")
    })
})

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register | Shop',
        isRegister: true,
        registerError: "Error"
    })
})

router.post('/login', async (req, res) => {
    
    //login qilish
    const {email, password} = req.body

    if(!email || !password) {
        req.flash('loginError', 'All fields is required')
        res.redirect('/login')
    }

    const existUser = await User.findOne({email})
    if(!existUser) {
        console.log('User not found') 
        return
    }

    const isPasswordEqual = await bcrypt.compare(password, existUser.password)

    if(!isPasswordEqual){ 
        console.log('Password wrong') 
        return 
    }

    console.log(`User found: ${existUser}`)
    res.redirect('/')
})

router.post('/register', async (req, res) => {

    const {firstname, lastname, email, password} = req.body
    // passwordni himoya (hash) qilish kodlari
    const hashhedPassword = await bcrypt.hash(password, 10)

    const userData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashhedPassword
    }
    const user = await User.create(userData)
    console.log(user)
    res.redirect('/')
})

export default router