import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { _id } = req.User;
  const { tweetContent } = req.body;
  if (!tweetContent) {
    throw new ApiError(400, "Tweet content is required");
  }
  const tweet = await Tweet.create({
    content: tweetContent,
    owner: _id,
  });

  if (!tweet) {
    throw new ApiError(500, "Tweet not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User id is required");
  }

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "twitter",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        twitter: {
          $arrayElemAt: ["$twitter", 0],
        },
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, tweets, "User tweets"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { tweetId } = req.params;
  const { tweetContent } = req.body;
  const {_id} = req.user

  const tweet = await Tweet.findById(tweetId).select("owner");
  if(tweet.owner !== _id){
    throw new ApiError(403, "You are not authorized to update")
  }
  if (!tweetContent) {
    throw new ApiError(400, "Tweet content is required");
  }
  if (!tweetId) {
    throw new ApiError(400, "Tweet id is required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: tweetContent,
      },
    },
    { new: true }
  );

  if(!updatedTweet){
    throw new ApiError(500, "Tweet not updated")
  }
  return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "Tweet id is required")
    }

const {_id} = req.user
const tweet = await Tweet.findById(tweetId).select("owner")
if(tweet.owner !== _id){
    throw new ApiError(403, "You are not authorized to delete")
}

const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
if(!deletedTweet){
    throw new ApiError(500, "Tweet not deleted")
}
  return res.status(200).json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
