// authController
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET belum di set');

const SALT_ROUNDS = 12; // Untuk bcrypt

module.exports = {
    //alur register
    register: async (req, res, next) => {
        try {
            const { username, pin, no_hp, nama_jurusan } = req.body;
            const pinStr = pin.toString();
            //validasi
            if (!username || !pin) return res.status(400).json({ message: 'username & pin wajib'});
            if (pinStr.length !== 6) {
            return res.status(400).json({ message: 'pin harus memiliki 6 angka' });
}

            // pengecekan user
            const [existing]= await pool.execute('SELECT id FROM users WHERE username =?', [username]);
            if (existing.length > 0){
                return res.status(409).json({ message: 'Username sadah terdaftar' });
            }
            //hash pengacakan password
            const hashed = await bcrypt.hash(pin, SALT_ROUNDS);

            //insert untuk user
            const [result] = await pool.execute(
                'INSERT INTO users (username, no_hp, nama_jurusan, pin) VALUES (?, ?, ?, ?)',
                [username, no_hp || null, nama_jurusan || null, hashed]  
            );

            const insertId = result.insertId;
            return res.status(201).json({id: insertId, username, no_hp: no_hp || null, nama_jurusan: nama_jurusan || null});
        } catch(err){
        next(err);
    }
},

// Login
    login: async (req, res, next) =>{
        try{
            const { username, pin } = req.body;
            if (!username || !pin) return res.status(400).json({ message: 'username & pin wajib'});

            // ambil user
            const [rows] = await pool.execute('SELECT id, username, pin, role_id, nama_jurusan, no_hp FROM users WHERE username = ?', [username]);
            if (rows.length ===0) return res.status(401).json({ message:'Invalid credential'});
            //pasword
            const user = rows[0]
            const match = await bcrypt.compare(pin, user.pin);
            if (!match) return res.status(401).json({ message: 'Invalid credential' });
            //sign JWT
            const payload = {id: user.id, username: user.username, role_id: user.role_id};
            const token = jwt.sign(payload, jwtSecret, { expiresIn:'30d' });

            return res.json({
                message: 'Login berhasil',
                token,
                user: { id: user.id, username: user.username, no_hp: user.no_hp, nama_jurusan: user.nama_jurusan}
            });
        } catch (err){
            next(err);
        }
    },

    //update pin
    updatePin: async (req, res, next) => {
        try {
            const { oldPin, newPin } = req.body;
            const userId = req.user.id;

            if (!oldPin || !newPin) {
                return res.status(400).json({ message: "oldPin & newPin wajib" });
            }

            if (newPin.toString().length !== 6) {
                return res.status(400).json({ message: "PIN baru harus 6 digit" });
            }

            const [rows] = await pool.execute(
                "SELECT id, pin FROM users WHERE id = ?", [userId]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: "User tidak ditemukan" })
            }

            const user = rows[0];

            const match = await bcrypt.compare(oldPin, user.pin)
            if (!match) {
                return res.status(400).json({ message: "PIN lama salah" })
            }

            const hashed = await bcrypt.hash(newPin, SALT_ROUNDS)

            await pool.execute(
                "UPDATE users SET pin = ? WHERE id = ?", [hashed, userId]
            );

            return res.json({ message: "PIN berhasil diupdate" })

        } catch (err) {
            next(err)
        }
    }
}       