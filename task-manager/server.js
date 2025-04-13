require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const methodOverride = require('method-override');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// EJS view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ROUTES

// GET / - Display all tasks
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.render('index', { tasks: result.rows, errors: [] });
  } catch (err) {
    res.status(500).send('Database error');
  }
});

// POST /tasks - Create a new task with validation
app.post(
  '/tasks',
  [
    body('title')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { title, description } = req.body;

    if (!errors.isEmpty()) {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return res.status(400).render('index', { tasks: result.rows, errors: errors.array() });
    }

    try {
      await pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, description]);
      res.redirect('/');
    } catch (err) {
      res.status(500).send('Database error while inserting');
    }
  }
);

// PATCH /tasks/:id - Toggle task completion
app.patch('/tasks/:id', async (req, res) => {
  try {
    await pool.query('UPDATE tasks SET completed = NOT completed WHERE id = $1', [req.params.id]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Database error while toggling completion');
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Database error while deleting task');
  }
});

// PUT /tasks/:id - Update title and description
app.put('/tasks/:id', async (req, res) => {
  const { title, description } = req.body;

  try {
    await pool.query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3', [
      title,
      description,
      req.params.id,
    ]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Database error while updating task');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
