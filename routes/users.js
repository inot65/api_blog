const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

// actualizare user
router.put('/:id', async (req, res) => {
  try {
    // nu pot actualiza decit propriul cont !
    if (req.body.userId === req.params.id) {
      // daca trimit parola in body, trebuie sa regenerez hash-ul la parola
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        // alterez parola transmisa !
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          {new: true}
        );

        const {password, ...other} = updatedUser._doc;
        res.status(200).json(other);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json('You can update only your account!');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// stergere user
router.delete('/:id', async (req, res) => {
  try {
    // nu pot sterge decit propriul cont !
    if (req.body.userId === req.params.id) {
      const user = await User.findById(req.params.id);
      try {
        // steg mai intai toate postarile userului, pt ca altfel raman postari FARA user
        await Post.deleteMany({username: user.username});

        try {
          // sterg userul
          await User.findByIdAndDelete(req.params.id);

          res.status(200).json('User has been deleted!');
        } catch (error) {}
        res.status(500).json(error);
      } catch (error) {
        res.status(404).json('User not found');
      }
    } else {
      res.status(401).json('You can delete only your account!');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const {password, ...other} = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
