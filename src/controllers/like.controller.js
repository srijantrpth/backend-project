import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { _id } = req.user;

  const likeCheck = await Like.findOne({ video: videoId, likedBy: _id });
  if (!likeCheck) {
    const like = await Like.create(
      {
        video: videoId,
        likedBy: _id,
      },
      { new: true }
    );
    if (!like) {
      throw new ApiError(500, "Error liking video");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Video liked successfully"));
  } else {
    const removeLike = await Like.deleteOne({ video: videoId, likedBy: _id });
    if (!removeLike) {
      throw new ApiError(500, "Error removing like from video");
    }
   return res.status(200).json(new ApiResponse(200, removeLike, "Video like removed successfully"));
  //TODO: toggle like on video
}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const likeCheck = await Like.findOne({comment: commentId, likedBy: req.user._id});
  if(!likeCheck){
    const like = await Like.create({
      comment: commentId,
      likedBy: req.user._id
    },{new:true})
    if(!like){
      throw new ApiError(500, "Error liking comment");
    }
  }
  else{
    const removeLike = await Like.deleteOne({comment: commentId, likedBy: req.user._id});
    if(!removeLike){
      throw new ApiError(500, "Error removing like from comment");
    }
    return res.status(200).json(new ApiResponse(200, removeLike, "Comment like removed successfully"));
  }

});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  const tweetCheck = await Like.findOne({tweet: tweetId, likedBy: req.user._id})
  if(!tweetCheck){
    const likeTweet = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id
    },{new:true})

    if(!likeTweet){
      throw new ApiError(500, "Error liking tweet");}
      return res.status(200).json(new ApiResponse(200, likeTweet, "Tweet liked successfully"));
    }
    else{
      const tweetLikeRemove = await Like.deleteOne({tweet: tweetId, likedBy: req.user._id});
      if(!tweetLikeRemove){
        throw new ApiError(500, "Error removing like from tweet");
      }
      return res.status(200).json(new ApiResponse(200, tweetLikeRemove, "Tweet like removed successfully"));
    }
  
  
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideos = await Like.aggregate([
    {
      $match:{
        likedBy: mongoose.Types.ObjectId(req.user._id),
        video: {$exists: true, $ne: null}
      }
    }
  ])
  if(!likedVideos){
    throw new ApiError(404, "No videos found");
  }

  return res.status(200, likedVideos[0], "Liked videos retrieved successfully");
});
// Check another approach for getLikedVideos in the file
export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
