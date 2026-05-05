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
            const{ username, pin, name} = req.body;
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
                'INSERT INTO users (username, name, pin) VALUES (?, ?, ?)',
                [username, name || null, hashed]
            );

            const insertId = result.insertId;
            return res.status(201).json({ id: insertId, username, name:name || null});
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
            const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
            if (rows.length ===0) return res.status(401).json({ message:'Invalid credential'});
            //pasword
            const user = rows[0]
            const match = await bcrypt.compare(pin, user.pin);
            if (!match) return res.status(401).json({ message: 'Invalid credential' });
            //sign JWT
            const payload = {id: user.id, username:user.username};
            const token = jwt.sign(payload, jwtSecret, { expiresIn:'30d' });

            return res.json({
                message: 'Login berhasil',
                token,
                user: { id: user.id, username: user.username, name: user.name}
            });
        } catch (err){
            next(err);
        }
    }
}       