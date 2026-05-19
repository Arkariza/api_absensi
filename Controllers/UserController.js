const db = require("../Config/db")

module.exports = {
    kirimIzin: async (req, res) => {
        try {

            const userId = req.user.id
            const { status, detail_keterangan } = req.body
            const bukti_keterangan = req.file
                ? req.file.filename
                : null

            if (!["izin", "sakit"].includes(status)) {
                return res.status(400).json({
                    message: "status tidak valid"
                })
            }

            const [already] = await db.query(
                `SELECT id 
                 FROM log_absen 
                 WHERE idUser = ? 
                 AND DATE(absen) = CURDATE()`,
                [userId]
            )

            if (already.length > 0) {
                return res.status(400).json({
                    message: "hari ini telah mengisi absensi"
                })
            }

            await db.query(
                `INSERT INTO log_absen 
                (
                    idUser,
                    absen,
                    status,
                    detail_keterangan,
                    bukti_keterangan
                ) 
                VALUES (?, NOW(), ?, ?, ?)`,
                [
                    userId,
                    status,
                    detail_keterangan || null,
                    bukti_keterangan
                ]
            )

            return res.json({
                message: `Berhasil dikirim ke Admin ${status}`,
                image: bukti_keterangan
            })

        } catch (error) {

            return res.status(500).json({
                message: "kesalahan wak",
                error: error.message
            })
        }
    },

    absenKetuaKelas: async (req, res) => {
        try {

            const userId = req.user.id

            const [already] = await db.query(
                `SELECT id 
                 FROM log_absen 
                 WHERE idUser = ? 
                 AND DATE(absen) = CURDATE()`,
                [userId]
            )

            if (already.length > 0) {
                return res.status(400).json({
                    message: "hari ini sudah absen"
                })
            }

            await db.query(
                `INSERT INTO log_absen 
                (
                    idUser,
                    absen,
                    status
                )
                VALUES (?, NOW(), ?)`,
                [
                    userId,
                    "hadir"
                ]
            )

            return res.json({
                message: "Absensi ketua kelas berhasil"
            })

        } catch (error) {

            return res.status(500).json({
                message: "gagal absen",
                error: error.message
            })
        }
    },

    getHistoriAbsen: async (req, res) => {
        try {
            const userId = req.user.id

            const [histori] = await db.query(
                `SELECT 
                    id, 
                    absen, 
                    status,
                    detail_keterangan,
                    bukti_keterangan
                 FROM log_absen 
                 WHERE idUser = ? 
                 ORDER BY absen DESC`,
                [userId]
            )

            return res.json({
                message: "behasil mengambil data Absen User",
                data: histori
            })

        } catch (error) {
            return res.status(500).json({
                message: "bahaya nih",
                error: error.message
            })
        }
    }
}