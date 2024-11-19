import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
const app = express();
const pool = new Pool({ 
    user: 'postgres', 
    host: 'localhost',
    database: 'assigner', 
    password: '0506',
    port: 5432,  
});

app.use(express.json());

app.post('/user-profiles', async (req, res) => {
    const {
        name, email, phone_no, educational_qualification,
        profile_pic, current_location, city, state, additional_info
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO user_profiles 
             (name, email, phone_no, educational_qualification, profile_pic, current_location, city, state, additional_info) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING *`,
            [name, email, phone_no, educational_qualification, profile_pic, current_location, city, state, additional_info]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user-profiles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM user_profiles');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/user-profiles/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    let query = 'UPDATE user_profiles SET ';
    fields.forEach((field, index) => {
        query += `${field} = $${index + 1}, `;
    });
    query = query.slice(0, -2); // Remove trailing comma
    query += ' WHERE id = $' + (fields.length + 1) + ' RETURNING *';

    try {
        const result = await pool.query(query, [...values, id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/user-profiles/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM user_profiles WHERE id = $1', [id]);
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
