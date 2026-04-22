const express = require('express');
const router = express.Router();
const cars = require('../data/cars');

// GET /api/cars — list all, with optional ?type= and ?make= filters
router.get('/', (req, res) => {
  let result = [...cars];
  const { type, make, search } = req.query;

  if (type && type !== 'All') result = result.filter(c => c.type === type);
  if (make && make !== 'All') result = result.filter(c => c.make === make);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.make.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      String(c.year).includes(q)
    );
  }

  res.json(result);
});

// GET /api/cars/:id — single car
router.get('/:id', (req, res) => {
  const car = cars.find(c => c.id === parseInt(req.params.id, 10));
  if (!car) return res.status(404).json({ error: 'Car not found' });
  res.json(car);
});

module.exports = router;
