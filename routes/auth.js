const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUSer = new User(
      {
        username,
        email,
        password: hashedPassword,
      }
    );
    // save on mongoDB
    const user = await newUSer.save();
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    !isMatch && res.status(401).json({ message: 'Password is incorrect' });

    // remove passwd on return data
    const { password, ...rest } = user._doc;

    res.status(200).json(rest);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;