const express = require("express");

const Post = require("../model/post");

exports.createPost = (req, res, next) => {

console.log(req.body.tittle,"res")
console.log(req.body,"reeeeeeeee")
  const url = req.protocol + "://" + req.get("host");
  const abc = req.get("host");
 // console.log("url", res);
  const bcd = req.protocol;
  // console.log("url", url);
  // console.log("abc", abc);
  // console.log("bcd", bcd);
  const post = new Post({
    tittle: req.body.tittle,
    content: req.body.content,
    creator: req.userData.userId,
  });
  console.log("adfafadf",post)
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "message from server posts created susscesful",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      console.log(error,"error")
      res.status(500).json({
        message:error,
      });
    });
};

exports.updatePost = (req, res, next) => {

  const post = new Post({
    _id: req.body.id,
    tittle: req.body.tittle,
    content: req.body.content,
  });
  console.log("updated post", post);
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Posts Updated succesfully!",
        });
      }
      console.log("result");
      res.status(401).json({
        message: "Posts Updated unsuccesfully!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't udpate post!",
      });
    });
};
exports.getPosts = (req, res, next) => {
  console.log("helpppp");
  const pageSize = +req.query.pagesize;
  console.log(pageSize, "pageSize");
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    console.log("iam here pagination");
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Feteched succesfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById({ _id: req.params.id })
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "post not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};
exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log("deleting", result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting posts failed!",
      });
    });
};

