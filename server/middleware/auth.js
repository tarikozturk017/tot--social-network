import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); // grabs "Authorization" header, token will be set there by frontend

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft(); // we are getting whatever there is after "Bearer ", this is where token starts
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); // verifies token
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}