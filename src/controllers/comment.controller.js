import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parse } from "dotenv";
import {isValidObjectId} from "mongoose";
const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const comments = await Comment.aggregate([
    {
      $match: {
        video: mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "commentBy",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
              email: 0,
              password: 0,
              coverImage: 0,
              watchHistory: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        commentBy: {
          $first: "$commentBy",
        },
      },
    },
    {
      $unwind: "$commentBy",
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
const {_id} = req.user;
const {videoId} = req.params;
const {commentText} = req.body;
if(!commentText){
    throw new ApiError(400, "Comment cannot be empty")
}
if(!mongoose.isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video ID")
}

const comment = await Comment.create({
    video: videoId,
    owner: _id,
    content: commentText
})
if(!comment){
    throw new ApiError(400, "Failed to add comment")
}

throw new ApiResponse(201, comment, "Comment added successfully")
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

const {commentId} = req.params;
const {commentText} = req.body;
const {_id} = req.user;
const ownerId = await Comment.findOne({_id: commentId}).select("owner")
if(!ownerId){
    throw new ApiError(404, "Comment not found")

}
if(ownerId.toString() !== _id.toString()){
    throw new ApiError(403, "You are not authorized to update this comment")
}
const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    $set: {
        content: commentText
    }
})
if(!updatedComment){
    throw new ApiError(400, "Failed to update comment")
}

return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
);

const deleteComment = asyncHandler(async (req, res) => {
  const {commentId} = req.params;

  if(!mongoose.isValidObjectId(commentId)){
      throw new ApiError(400, "Invalid comment ID")
  }
    const {_id} = req.user;
    const authCheck = await Comment.findOne({_id: commentId}).select("owner")

    if(authCheck!==_id){
        throw new ApiError(403, "You are not authorized to delete this comment")
    }
    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if(!deletedComment){
        throw new ApiError(400, "Failed to delete comment!")
    }
    return res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted successfully"))

});

export { getVideoComments, addComment, updateComment, deleteComment };
