const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Post = require('../models/post');

//Update User
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body
        },
        // force update
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: 'You can update your account' });
  }
})

//Delete User
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ user: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    } catch (err) {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(401).json({ message: 'You can delete your account' });
  }
})

//get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    res.status(404).json({ message: 'User not found' });
  }
})

module.exports = router;


