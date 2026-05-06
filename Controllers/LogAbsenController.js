const db = require("../Config/db")
const crypto = require("crypto")
const SECRET = "JWT_TOKEN"

exports.scanQR = async(req, res) => {
    try{
        const {qr} = req.body

        if(!qr){
            return res.status(400).json({message: "QR kosong"})
        }

        const parts = qr.split(":")
        const [userId, timestamp, hash] = parts

        if(parts.length !==3){
            return res.status(400).json({message: "Format QR Invalid"})
        }

        const validHash = crypto
        .createHmac("sha256", SECRET)
        .update(`${userId}:${timestamp}`)
        .digest("hex")

        if(hash !== validHash){
            return res.status(400).json({message: "QR gak Valid"})
        }

        const now = Date.now()
        const maxAge = 15 * 1000

        if(now - Number(timestamp) > maxAge){
            return res.status(400).json({message: "QR Expire, Silahkan Restart"})
        }

        const [user] = await db.query(
            "SELECT id, nama FROM users WHERE id = ?",
            [userId]
        )

        if(!user.length){
            return res.status(404).json({message: "User gak ditemukan"})
        }

        const [already] = await db.query(
            "SELECT id FROM log_absen WHERE id_user = ? AND DATE(absen) = CURDATE()",
            [userId]
        )

        if(already.length > 0){
            return res.status(400).json({message: "User ini sudah Absen"})
        }

        await db.query(
            "INSERT INTO log_absen (id_user, absen) VALUES (?, NOW())",
            [userId]
        )

        return res.json({message: "Absen berhasil", user: user[0], waktu: new Date()})
    }catch(error){
        return res.status(500).json({message: "Bahaya Nih", error: error.message})
    }
}