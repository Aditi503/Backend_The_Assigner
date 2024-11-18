const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'assigner', 
    password: '0506',
    port: 5432, 
});

app.use(bodyParser.json());

app.post('/contact', async (req, res) => {
    const { name, email, phone_number, address, subject, message } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO contact (name, email, phone_number, address, subject, message)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, email, phone_number, address, subject, message]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error inserting data' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
