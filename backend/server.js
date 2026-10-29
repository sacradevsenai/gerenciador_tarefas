const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db');
const { error } = require('node:console');

const PORT = 3000;

app.use(cors());
app.use(express.json());


//DESENVOLVENDO O GET

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET POR ID

app.get('/tasks/:id', (req, res) => {
    db.query('SELECT * FROM tasks WHERE id = ?',[req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Tarefa não foi encontrada' });
        res.json(results[0]);
    });
});

// POST

app.post('/tasks', (req, res) => {
    const {title, description} = req.body;
    db.query('INSERT INTO tasks (title, description) VALUES (?,?)', [title, description], (err, results) =>{
        if (err) return res.status(500).json({error: err.message});
        res.status(201).json({id: results.insertId, title, description, completed: false});
    })
})

