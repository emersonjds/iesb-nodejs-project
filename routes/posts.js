const router = require('express').Router();
const Post = require('../models/post');

// Create a new post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    try {
      if (post.username === req.body.username) {
        try {
          const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
          }, { new: true });
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      } else {
        res.status(401).json({ message: "You are not authorized to edit this post" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    try {
      if (post.username === req.body.username) {
        try {
          await Post.findByIdAndDelete(req.params.id);
          res.status(200).json({ message: "Post deleted" });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      } else {
        res.status(401).json({ message: "You are not authorized to delete this post" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

//get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

//get all posts
router.get("/", async (req, res) => {
  const username = req.query.user;
  const categoryName = req.query.category;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username: username });
    } else if (categoryName) {
      posts = await Post.find({
        categories: {
          $in: [categoryName]
        }
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})






module.exports = router;


