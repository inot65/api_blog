const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// inregistrare user
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.username,
      password: hashedPass,
    });

    const user = await newUser.save();
    const {password, ...other} = newUser._doc;
    res.status(200).json(other);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// login user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});

    // verific daca exista userul cu numele transmis
    if (!user) {
      return res.status(400).json('Wrong credentials!');
    }

    // verific ca parola transmisa este ok

    const validatedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatedPassword) {
      return res.status(400).json('Wrong credentials!');
    }

    const {password, ...other} = user._doc;
    // user este validat, pot trimite inapoi userul care s-a logat
    res.status(200).json(other);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
