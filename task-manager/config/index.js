require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const methodOverride = require('method-override');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// Database pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  res.render('index', { tasks: result.rows, errors: [] });
});

app.post(
  '/tasks',
  [
    body('title').isLength({ min: 3, max: 100 }).withMessage('Title must be 3–100 characters.'),
    body('description').isLength({ max: 500 }).withMessage('Description max 500 characters.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { title, description } = req.body;

    if (!errors.isEmpty()) {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return res.render('index', { tasks: result.rows, errors: errors.array() });
    }

    await pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, description]);
    res.redirect('/');
  }
);

app.patch('/tasks/:id', async (req, res) => {
  await pool.query('UPDATE tasks SET completed = NOT completed WHERE id = $1', [req.params.id]);
  res.redirect('/');
});

app.delete('/tasks/:id', async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.redirect('/');
});

app.put('/tasks/:id', async (req, res) => {
  const { title, description } = req.body;
  await pool.query('UPDATE tasks SET title=$1, description=$2 WHERE id=$3', [title, description, req.params.id]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
