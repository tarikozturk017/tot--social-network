import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            // https://mongoosejs.com/docs/schematypes.html check example
            type: Map, // could be use array, this is more efficient
            of: Boolean,
        },
        comments: {
            type: Array,
            default: []
        }
    }, {timestamps: true} // auto date when created/updated
);

const Post = mongoose.model("Post", postSchema);
export default Post;