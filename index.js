const express = require('express')
const app = express()
require("./Corn/AutoAlpha")
require("dotenv").config()

app.use(express.json())

const loginRoute = require("./Routes/LoginRoute") //< cuma ada login sama update pin
const logAbsen = require("./Routes/LogAbsenR") //< log absen all, log absen by usr id, log absen get hari ini{today}
const qrRoute = require("./Routes/QRroute") //< buat nampilin qr di halaman user
const scannerQr = require("./Routes/ScannerR") //< buat admin ngescan qr user buat absen
const userAkses = require("./Routes/UserRoute") //< akses user

app.use("/api/auth", loginRoute) //< "/login" dan "/update-pin" "/get-profile"
app.use("/api/admin-only", logAbsen) //< "/log" || "/log/:id" || "/log-hari-ini"
app.use("/api/kode-qr", qrRoute) //< "/qr"
app.use("/api/scanner", scannerQr) //< "/scan"
app.use("/api/user-akses", userAkses) //< "/izin" || "/histori"

app.get("/", (req, res) => {res.send("done yah ngafs");});



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running di http://localhost:${PORT}`)
})
