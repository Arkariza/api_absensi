const express = require ('express')

function adminCheck(req, res, next) {
    const userRole = req.user.role; 
        if (userRole === 1 ) {
            next();
        } else {
            res.status(403).json({Message : "Akses Ditolak"}) 
        }
}

function userCheck(req, res, next) {
    const userRole = req.user.role; 
    if (userRole === 2 ) {
        next ();
    } else {
        res.status(403).json({Message : "Silahkan Login Terlebih Dahulu."})
    }
}

module.exports = {adminCheck, userCheck};