import { Router } from "express";
import User from '../models/user.js'

// passwordni hash qilish uchun kutubxona
import bcrypt from 'bcrypt'
import { generateJWTToken } from "../services/token.js";

const router = Router()

// Login
router.get('/login', (req, res) => {
   res.render('login', {
        title: 'Login | Shop',
        isLogin: true,
        loginError: req.flash('loginError')
    })
})

router.post('/login', async (req, res) => {
    //login qilish
    const {email, password} = req.body

    if(!email || !password) {
        req.flash('loginError', 'All fields is required')
        res.redirect('/login')
        return
    }

    // email va password orqali login qilish
    const existUser = await User.findOne({email})
    if(!existUser) {
        req.flash('loginError','User not found') 
        res.redirect('/login')
        return
    }

    // password orqali login qilish
    const isPasswordEqual = await bcrypt.compare(password, existUser.password)
    if(!isPasswordEqual){ 
        req.flash('loginError','Password wrong')
        res.redirect('/login') 
        return 
    }

    const token = generateJWTToken(existUser._id)
    res.cookie('token', token, {httpOnly: true, secure: true})
    res.redirect('/')
})

// Register

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register | Shop',
        isRegister: true,
        registerError: req.flash('registerError')
    })
})



router.post('/register', async (req, res) => {

    const {firstname, lastname, email, password} = req.body

    if(!firstname || !lastname || !email || !password){
        req.flash('registerError', 'Please! make sure to fill out all the information entry sections')
        res.redirect('/register')
        return
    }

    const candidate = await User.findOne({email})

    if(candidate){
        req.flash('registerError', 'This emailaddress already exist')
        res.redirect('/register')
        return
    }

    // passwordni himoya (hash) qilish kodlari
    const hashhedPassword = await bcrypt.hash(password, 10)

    const userData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: hashhedPassword
    }
    const user = await User.create(userData)
    const token = generateJWTToken(user._id)
    res.cookie('token', token, {httpOnly: true, secure: true})
    res.redirect('/')
})

export default router