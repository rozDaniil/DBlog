import express from 'express'
import cors from 'cors'
import fs from 'fs'
import mongoose from 'mongoose'
import multer from 'multer'

import { UserController } from './controller/UserController.js'
import { PostController } from './controller/PostController.js'
import { CommentsControler } from './controller/CommentsController.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import { registerValidation, loginValidation } from './validation/authValidation.js'
import { postCreateValidation } from './validation/postValidation.js'
import { userUpdateValidation } from './validation/userValidation.js'
import { commentCreateValidation } from './validation/commentValidation.js'
import checkAuth from './utils/checkAuth.js'

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('DB OK!')
    })
    .catch((err) => {
        console.log(err, 'DB failed!')
    })

const PORT = 8888
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.file.originalname}`
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('/comment', CommentsControler.getComment)
app.post('/comment', checkAuth, commentCreateValidation, handleValidationErrors, CommentsControler.addComment)

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/user/:id', checkAuth, UserController.getUser)
app.patch('/user/:id', userUpdateValidation, handleValidationErrors, checkAuth, UserController.updateUser)

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation, handleValidationErrors, PostController.createPost)
app.patch('/posts/:id',checkAuth, postCreateValidation, handleValidationErrors, PostController.updatePost)
app.delete('/posts/:id', checkAuth, PostController.deletePost)
app.get('/posts/user/:id', PostController.getUser)

app.listen(process.env.PORT || PORT, (err) => {
    if (err) {
        return console.log(err)
    } 
    console.log(`Server OK, running on port: ${PORT}`)
})