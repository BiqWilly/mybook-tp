const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Newest first
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE a post
router.post('/', async (req, res) => {
  const { title, content, author, authorId } = req.body;
  const post = new Post({ title, content, author, authorId });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ADD a comment
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({
      author: req.body.author,
      text: req.body.text
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;