const Comment = require("../Models/Comment");
const Post = require("../Models/Post");

const createCommentPost = async (req, res, next) => {
  try {
    //Lay thong tin tu phia client
    const { content, idPost } = req.body;
    const files = req.files;
    const user = req.user;

    //Kiem tra bai post con ton tai hay khong
    const postFound = await Post.findById(idPost);

    if (postFound) {
      //Kiem tra comment co hinh anh hay khong
      const img_list = [];

      //Neu co thi luu vao thuoc tinh imgs
      if (files) {
        const len = files.length;
        var i = 0;
        for (i; i < len; i++) {
          img_list.push(files[i].filename);
        }
      }

      //Tao object comment voi cac thuoc tinh tu client
      const comment = new Comment({
        idPost,
        idUser: user._id,
        content,
        imgs: img_list,
      });

      //Luu comment vao database de lay id
      await comment.save();

      //Push idComment vao bai Post
      postFound.comment.push(comment._id);
      await postFound.save();

      //Thanh cong tra ve status code 200

      return res.status(200).send({
        data: comment,
        message: "Đã thêm bình luận của bạn vào bài viết",
      });
    }

    //Neu bai viet khong ton tai thi tra ve status code 201
    handlerCustomError(201, "Bài viết không tồn tại");
  } catch (error) {
    next(error);
  }
};

const deleteCommentByID = async (req, res, next) => {
  try {
    const { idComment } = req.params;
    await Comment.findByIdAndDelete(idComment);
    return res.status(200).send("Đã xóa bình luận");
  } catch (error) {
    next(error);
  }
};

const deleteCommentByPost = async (req, res, next) => {
  try {
    const idPost = "5ffe94e5e8c21e0c441e32bc";
    await Comment.deleteMany({ idPost: idPost });
    return res.status(200).send("Xóa bình luận thành công");
  } catch (error) {
    next(error);
  }
};

const getCommentByPost = async (req, res, next) => {
  try {
    const idPost = "5ffd2debfc4c8b1dd8791cc2";
    const commentList = await Comment.find({ idPost: idPost })
      .populate("idPost")
      .populate("idUser");
    return res.status(200).send(commentList);
  } catch (error) {
    next(error);
  }
};
const handlerCustomError = (status, message) => {
  const err = new Error();
  err.status = status || 500;
  err.message = message;
  throw err;
};
module.exports = {
  createCommentPost,
  deleteCommentByID,
  deleteCommentByPost,
  getCommentByPost,
};
