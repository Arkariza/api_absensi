const express = require("express")
const router = express.Router()

const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")
const userController = require("../Controllers/UserController")

router.post("/izin", auth, role.userCheck, userController.kirimIzin)
router.get("/histori", auth, role.userCheck, userController.getHistoriAbsen)

module.exports = router