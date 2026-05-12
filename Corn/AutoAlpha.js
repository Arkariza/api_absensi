const cron = require("node-cron")
const db = require("../Config/db")

cron.schedule("59 23 * * *", async () => {
    try {
        const today = new Date().getDay()

        if (today === 0 || today === 6) {
            console.log("Weekend, auto alpha dilewati")
            return
        }

        console.log("Auto alpha aktif...")

        const [users] = await db.query(
            `SELECT id FROM users`
        )

        for (const user of users) {

            const [exists] = await db.query(
                `SELECT id FROM log_absen 
                 WHERE idUser = ? 
                 AND DATE(absen) = CURDATE()`,
                [user.id]
            )

            if (exists.length === 0) {

                await db.query(
                    `INSERT INTO log_absen (idUser, absen, status) 
                     VALUES (?, NOW(), ?)`,
                    [user.id, "alpha"]
                )

                console.log(`User ${user.id} alpha`)
            }
        }

        console.log("Auto alpha selesai")

    } catch (error) {
        console.log("Auto alpha error:", error.message)
    }
})