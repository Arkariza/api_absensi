const express = require ('express')

function adminCheck(req, res, next) {
    if (req.user.role_id === 1) {
        return next()
    }
    return res.status(403).json({ message: "Akses ditolak (Admin only)" })
}

function userCheck(req, res, next) {
    if (req.user.role_id === 2 ) {
        return next ()
    }
    return res.status(403).json({Message : "Silahkan Login Terlebih Dahulu."})
}

module.exports = {adminCheck, userCheck}