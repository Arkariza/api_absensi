const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) throw new Error('User Invalid')

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.get('User Ditemukan')

        if (!authHeader) {
            return res.status(401).json({ message: 'Tidak Mendapatkan Token, Mohon Restart Web/Aplikasinya' })
        }

        const parts = authHeader.split(` `)

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: 'Format Data Invalid!' })
        }

        const token = parts[1]

        jwt.verify(token, jwtSecret, (err, decoded) => {
            if(err){
                return res.status(401).json({message: 'Invalid Token Restart Now!'})
            }
            req.user = {
                id: decoded.id,
                name: decoded.name
            }
            next()
        })
    }catch(err){
        next(err)
    }
}