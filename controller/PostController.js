import PostModel from '../model/Post.js'

export const PostController = {
    getAll: async (req, res) => {
        try {
            const posts = await PostModel.find().sort([['_id', -1]] ).populate('user').exec()

            res.json(posts)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при получении постов!'
            })
        }
    },
    getOne: async (req, res) => {
        try {
            const postId = req.params.id

            PostModel.findOneAndUpdate({
                _id: postId
            }, {
                $inc: { viewsCount: 1 }
            }, {
                returnDocument: 'after'
            }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Ошибка при поиске статьи!'
                    })
                }
    
                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Не удалось найти статью!'
                    })
                }

                res.json(doc)
            }).populate('user')
            } 
        catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Error during article find"
            })        
        }
    },
    createPost: async (req, res) => {
        try {
            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId
            })

            const post = await doc.save()

            console.log(req.body)

            res.json(post)
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: 'Ошибка при создании поста!'
            })    
        }
    },
    updatePost: async (req, res) => {
        try {
            const postId = req.params.id

            await PostModel.updateOne({
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
            })
            res.json({
                message: 'success: TRUE'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при обновлении статьи!'
            })    
        }
    },
    deletePost: async (req, res) => {
        try {
            const postId = req.params.id

            PostModel.findOneAndDelete({
                _id: postId
            }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Ошибка при удалении статьи!'
                    })
                }

                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Не удалось найти статью!'
                    })
                }

                res.json({
                    success: true
                })
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при удалении статьи!'
            })    
        }
    },
    getUser: async (req, res) => {
        try {
            const posts = await PostModel.find().sort([['_id', -1]] )
            const userId = req.params.id
    
            const userPosts = posts.filter(post => post.user == userId)
            res.json(userPosts)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ошибка при получении постов!'
            })
        }
    },
}