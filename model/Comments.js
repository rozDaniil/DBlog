import mongoose from 'mongoose'

const CommentsSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    imageUrl: String,


}, {
    timestamps: true
})

export default mongoose.model('Comments', CommentsSchema)