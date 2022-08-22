import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserModel from '../model/User.js'

export const UserController = {
    login: async (req, res) => {
        try {
            const user = await UserModel.findOne({
                email: req.body.email
            })
    
        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль!'
            })
        }
    
        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash)
    
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль!'
            })
        }
    
        const { passwordHash, ...userData } = user._doc
    
        const token = jwt.sign({
            _id: user.id
        },
        'uniqueToken',
        {expiresIn: '30d'}
        )
    
        return res.json({
            ...userData,
            token
        })
    
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при аторизации'
            })
        }
    },
    register: async (req, res) => {
        try {
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const duplicateEmail = UserModel.findOne({
                email: req.body.email
            })
            const duplicateName = UserModel.findOne({
                fullName: req.body.fullName
            })

            if (duplicateEmail._doc) {
                return res.status(400).json({
                    message: 'Пользователь с такой почтой уже существует!'
                })    
            }
            if (duplicateName._doc) {
                return res.status(400).json({
                    message: 'Пользователь с таким именем уже существует!'
                })    
            }

            const doc = new UserModel({
                email: req.body.email,
                fullName: req.body.fullName,
                passwordHash: hash,
                avatarUrl: req.body.avatarUrl
            })

    
            const user = await doc.save()
    
            const { passwordHash, ...userData } = user._doc
    
            const token = jwt.sign({
                _id: user._id
            },
            'uniqueToken',
            {
                expiresIn: '30d'
            })
    
            return res.json({...userData, token})
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                message: 'Error during registration'
            })
        }
    },
    getMe: async (req, res) => {
        try {
            const user = await UserModel.findById(req.userId)
    
            if (!user) {
                res.status(404).json({
                    message: 'Неверный логин или пароль!'
                })
            }
    
            const { passwordHash, ...userData} = user._doc
        
            res.json(userData)    
    
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при авторизации'
            })
        }
    },
    getUser: async (req, res) => {
        const userId = req.params.id
        
        UserModel.findOne({
            _id: userId
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Ошибка при получении пользователя!'
                })
            }
    
            if (!doc) {
                console.log(err)
                return res.status(404).json({
                    message: 'Не удалось найти пользователя!'
                })
            }
    
            res.json(doc)
        })
    },
    updateUser: async (req, res) => {
        try {
            const userId = req.params.id
    
            await UserModel.updateOne({
                _id: userId
            }, {
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl
            })
    
            res.json({
                success: true
            })
    
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при обновлении пользователя!'
            })    
        }
    }
}