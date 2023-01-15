import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; // paths and routes for every feature
import userRoutes from "./routes/users.js"; 
import postRoutes from "./routes/posts.js"; 
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js"
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js"


// CONFIGURATIONS 
const __filename = fileURLToPath(import.meta.url); // it grabs the file url 
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // sets directory where we keep our assets

// FILE STORAGE
// when file uploaded, it will be saved in assets
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// ROUTES WITH FILES

// auth/register is the route, and upload the picture locally w/ middleware to public/assets, register is the controller function
app.post("/auth/register", upload.single("picture"), register); //normally it should be in route file, it is in index because "upload" is here
app.post("/posts", verifyToken, upload.single("picture"), createPost); // images will be located in 'picture' in HTTP call. So it will get it and upload it to local

// ROUTES
app.use("/auth", authRoutes); // this '/auth' will be pre route for every route in authRoutes. ex-> '/auth/login'
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`${PORT} connected`))

    // when it starts, set the data one time
    // should be done 1 time    
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((err) => console.log(`${err} did not connect`))

