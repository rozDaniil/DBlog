import { body } from 'express-validator'

export const userUpdateValidation = [
    body('fullName', 'Укажите имя').isString().isLength({ min: 5 }),
    body('avatarUrl').optional(),
]