const router = require('express').Router();
const Category = require('../models/category');

router.post('/', async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).send(error);
  }
})

router.get('/', async (req, res) => {
  const categories = await Category.find();
  try {
    res.json(categories);
  } catch (error) {
    res.status(400).send(error);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send();
    }
    res.json(category);
  } catch (error) {
    res.status(500).send(error);
  }
})

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).send();
    }
    res.json(category);
  } catch (error) {
    res.status(500).send(error);
  }
})

module.exports = router;