const db = require("../Config/db")

exports.getLogs = async(req, res) =>{
    try{
        const logs = await db.query(
            `SELECT l.id, u.nama, u.no_hp, u.nama_jurusan, l.absen FROM absen l JOIN users u ON u.id = l.id_user ORDER BY l.absen DESC`
        )

        res.json({message: "Data Absensi berhasil di load", data: logs})

    }catch(error){
        res.status(500).json({message: "Something Wrong Just I can Feel it", error: error.message})
    }
}

exports.getLogsByUser = async(req, res) => {
    try {
        const { id } = req.params

        const logs = await db.query(
            `SELECT l.id, u.nama, u.no_hp, u.nama_jurusan, l.absen FROM log_absen l JOIN users u ON u.id = l.id_user WHERE u.id = ? ORDER BY l.absen DESC`, [id]
        )

        res.json({message: "Berhasil ambil log user", data: logs})

    }catch(error){
        res.status(500).json({message: "Terjadi kesalahan", error: error.message})
    }
}

exports.getTodayLogs = async(req, res) => {
    try {
        const logs = await db.query(
            `SELECT l.id, u.nama, u.no_hp, u.nama_jurusan, l.absen l JOIN users u ON u.id = l.id_user WHERE DATE(l.absen_at) = CURDATE() ORDER BY l.absen_at DESC`   
        )

        res.json({message: "Log absensi hari ini", data: logs})
    }catch(error) {
        res.status(500).json({message: "Terjadi kesalahan", error: error.message})
  }
}