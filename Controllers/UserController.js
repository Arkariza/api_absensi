const db = require("../Config/db")

module.exports = {
    kirimIzin: async(req, res) => {
        try{
            const userId = req.user.id
            const {status} = req.body
    
            if(!["izin", "sakit"].includes(status)){
                return res.status(400).json({message: "status tidak valid"})
            }
    
            const [already] = await db.query(
                `SELECT id FROM log_absen WHERE idUser = ? AND DATE(absen) = CURDATE()`,
                [userId]
            )
    
            if(already.length > 0){
                return res.status(400).json({message: "hari ini telah mengisi absensi"})
            }
    
            await db.query(
                `INSERT INTO log_absen (idUser, absen, status) VALUES (?, NOW(), ?)`,
                [userId, status]
            )
    
            return res.json({message: `Berhasil dikirm ke Admin ${status}`})
        }catch(error){
            return res.status(500).json({message: "kesalahan wak",
                error: error.message
            })
        }
    },

    getHistoriAbsen: async(req, res) => {
        try{
            const userId= req.user.id
            const [histori] = await db.query(
                `SELECT id, absen, status FROM log_absen WHERE idUser = ? ORDER BY absen DESC`,
                [userId]
            )

            return res.json({message: "behasil mengambil data Absen User", data: histori})
        }catch(error){
            return res.status(500).json({message: "bahaya nih",
                error: error.message
            })
        }
    }

}