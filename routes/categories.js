const router = require('express').Router();
const Category = require('../models/Category');

// create new category
router.post('/', async (req, res) => {
  // fac noua categorie cu datele transmise
  const newCategory = new Category(req.body);

  // salvez noua categorie
  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all posts by user or by category
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
