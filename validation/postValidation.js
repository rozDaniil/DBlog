import { body } from 'express-validator'

export const postCreateValidation = [
    body('title', 'Заголовок статьи должен быть не меньше 5 символов').isString().isLength({ min: 5 }),
    body('text','Текст статьи должен быть не меньше 10 символов').isString().isLength({ min: 10 }),
    body('tags').optional().isArray(),
    body('imageUrl').optional(),
]