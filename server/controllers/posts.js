import Post from "../models/Post.js"
import User from "../models/User.js";

// CREATE

// middleware ( upload.single("picture") ) will handle the picture, it handles the post 
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body; // it will be sent from front-end
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find(); // get all the post, so it returns all the posts to the frontend 
        res.status(201).json(post);

    } catch (err) {
        res.status(409).json({ message: err.message });
    }   
}

// READ

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find(); // get all the post, so it returns all the posts to the frontend 
        res.status(200).json(post); // successfully send respond to the front end with all the post
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params; // userId will come from http parameter
        const post = await Post.find({ userId }); // get the user's post
        res.status(200).json(post); 
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

// UPDATE

export const likePost = async (req, res) => {
    try {
        const { id } = req.params; // post id comes from parameters
        const { userId } = req.body; // user id comes from request body
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // check if the like user liked the post

        // if liked delete, else set user to like
        if (isLiked) post.likes.delete(userId);
        else post.likes.set(userId, true);

        const updatedPost = await Post.findByIdAndUpdate(
            id, // find this post and update
            { likes: post.likes }, // list of likes that was changed
            { new: true } // creates a new object   
        )

        res.status(200).json(updatedPost); 
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}