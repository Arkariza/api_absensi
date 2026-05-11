const cron = require("node-cron")
const db = require("../Config/db")

cron.schedule("59 23 * * *", async() =>{
    try{
        const today = new Date().getDay()
        if(today === 0 || today === 6){
            console.log("weekend, ga bisa alpha")
            return
        }

        console.log("mode auto alhpa on aktif")

        const [exists] = await db.query(
            `SELECT id FROM log_absen WHERE idUser = ? AND DATE(absen) = CURDATE()`,
            [user.id]
        )

        if(exists.length === 0){
            await db.query(
                `INSERT INTO log_absen (idUser, absen, status) VALUES (?, NOW(), alpha)`,
                [user.id, "alpha"]
            )
            console.log(`user ${user.id} alpha`)
        }
    }catch(error){
        console.log("auto alpha error", error.message)
    }
})