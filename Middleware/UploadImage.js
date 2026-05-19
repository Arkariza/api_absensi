const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {
        const unique = Date.now() + path.extname(file.originalname)
        cb(null, unique)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowed = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "image/heic",
            "image/heif"
        ]

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Format harus gambar"))
        }

        cb(null, true)
    }
})

module.exports = upload