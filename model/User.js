import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    passwordHash: {
        type: String,
        require: true
    },
    avatarUrl: String
}, {
    timestamps: true,
})

export default mongoose.model('User', userSchema)