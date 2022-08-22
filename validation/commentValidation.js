import { body } from 'express-validator'

export const commentCreateValidation = [
    body('text','Текст комментария должен быть не меньше 3-х символов').isString().isLength({ min: 3 }),
]