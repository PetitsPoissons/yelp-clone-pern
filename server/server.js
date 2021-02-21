require('dotenv').config();
const express = require('express');
const db = require('./db');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.use(express.json());

// Get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM restaurants');
    console.log(rows);
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        restaurants: rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Get a restaurant
app.get('/api/v1/restaurants/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const { rows } = await db.query('SELECT * FROM restaurants WHERE id = $1', [
      req.params.id,
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a restaurant
app.post('/api/v1/restaurants', async (req, res) => {
  console.log(req.body);
  try {
    const {
      rows,
    } = await db.query(
      'INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *',
      [req.body.name, req.body.location, req.body.price_range]
    );
    res.status(201).json({
      status: 'success',
      data: {
        restaurant: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update a restaurant
app.put('/api/v1/restaurants/:id', async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  try {
    const {
      rows,
    } = await db.query(
      'UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *',
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );
    res.status(200).json({
      status: 'success',
      data: {
        restaurant: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Delete a restaurant
app.delete('/api/v1/restaurants/:id', async (req, res) => {
  try {
    const { rows } = await db.query('DELETE FROM restaurants where id = $1', [
      req.params.id,
    ]);
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
