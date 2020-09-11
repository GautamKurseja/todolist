const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const PostController = require("../controllers/posts")
const checkAuth = require("../middlewares/check-auth");


router.post("", checkAuth,  PostController.createPost);

router.put("/:id", checkAuth, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
