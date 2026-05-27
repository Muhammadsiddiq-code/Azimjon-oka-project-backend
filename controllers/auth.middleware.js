const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "secret_key_5577"

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "token topilmadi" })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, JWT_SECRET)
        req.admin = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token yaroqsiz" })
    }
}
