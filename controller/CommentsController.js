import CommentsModel from '../model/Comments.js'

export const CommentsControler = {
    addComment: async (req, res) => {
        try {
            const doc = new CommentsModel({
                text: req.body.text,
                user: req.userId,
                post: req.body.postId
            })
            const comment = await doc.save()
    
            res.json(comment)
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Ошибка при создании комментария!'
            })
        }
    },
    getComment: async (req, res) => {
        try {
            const comment = await CommentsModel.find().sort([['_id', -1]] ).populate('user').exec()
    
            res.json(comment)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при загрузке комментариев!'
            })
        }
    }
}