const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postCtrl = require("../controllers/posts");

router.get("/", auth, postCtrl.getAllPosts);
router.get("/postlikes", auth, postCtrl.getAllLikesPosts);
router.get("/postdislikes", auth, postCtrl.getAllDislikesPosts);
router.get("/commentslikes", auth, postCtrl.getAllLikesComments);
router.get("/commentsdislikes", auth, postCtrl.getAllDislikesComments);
router.get("/getlastcomment", auth, postCtrl.getLastComment);
router.get("/singlepost/:postId", auth, postCtrl.getSinglePost);
router.get("/comments/:postId", auth, postCtrl.getCommentsPost);
router.get("/comments/:postId/:replyParentId", auth, postCtrl.getReply);
router.post("/", auth, multer, postCtrl.uploadPost);
router.post("/likepost", auth, postCtrl.likePost);
router.post("/dislikepost", auth, postCtrl.dislikePost);
router.post("/comment/:postId", auth, postCtrl.commentPost);
router.post("/likecomment", auth, postCtrl.likeComment);
router.post("/dislikecomment", auth, postCtrl.dislikeComment);
router.put("/editpost/:postId", auth, multer, postCtrl.editPost);
router.put("/editcomment", auth, postCtrl.editComment);
router.delete("/deletepost/:postId", auth, postCtrl.deletePost);
router.delete("/deletecomment/:commentId", auth, postCtrl.deleteComment);
router.delete("/deletelikepost/:postId/:userId", auth, postCtrl.deleteLikePost);
router.delete(
  "/deletedislikepost/:postId/:userId",
  auth,
  postCtrl.deleteDislikePost
);
router.delete(
  "/deletelikecomment/:commentId/:userId",
  auth,
  postCtrl.deleteLikeComment
);
router.delete(
  "/deletedislikecomment/:commentId/:userId",
  auth,
  postCtrl.deleteDislikeComment
);

module.exports = router;
