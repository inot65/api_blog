const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

// create new post
router.post('/', async (req, res) => {
  // fac noul post cu datele transmise
  const newPost = new Post(req.body);

  // salvez noua postare
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// actualizare post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // daca postul este facut de userul care doreste actualizarea, merg mai departe
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          {new: true}
        );

        // returnez postul actualizat
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json('You can update only your post!');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// stergere post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      // try {
      // console.log(post);
      await post.deleteOne();
      // console.log(rez);
      res.status(200).json('Post has been deleted...');
      // } catch (err) {
      // res.status(500).json(err);
      // }
    } else {
      res.status(401).json('You can delete only your post!');
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all posts by user or by category
router.get('/', async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;

  try {
    let posts;
    if (username) {
      posts = await Post.find({username: username});
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
