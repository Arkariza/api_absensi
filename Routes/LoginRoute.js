const express = require("express")
const router = express.Router()

const authController = require("../Controllers/AuthController")
const auth = require("../Middleware/AuthMiddleware")
const role = require("../Middleware/RoleMiddleware")
const validasi = require("../Middleware/ValidationMiddleware")

router.post("/register", validasi.validateRegister, authController.register)
router.post("/login", validasi.validateLogin, authController.login)
router.put("/update-pin", validasi.validateUpdatePin, auth, authController.updatePin)
router.get("/get-profile", auth, authController.getProfile)

module.exports = router