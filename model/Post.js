import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    text: {
        type: String,
        require: true,
    },
    tags: {
        type: Array,
        default: []
    },
    imageUrl: String,
    viewsCount: {
        default: 0,
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }

}, {
    timestamps: true
})

export default mongoose.model('Post', PostSchema)