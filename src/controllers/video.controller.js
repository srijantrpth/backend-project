import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const videos = Video.aggregate([
    {
      $match: {
        owner: new mongoose.Schema.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "postedBy",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
              username: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        postedBy: {
          $arrayElemAt: ["$postedBy", 0],
        },
      },
    },
    {
      $unwind: "$postedBy",
    },
    {
      $project: {
        postedBy: 1,
        title: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) },
    {$sort: {createdAt: 1}}
  ]);
  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully! "));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

if(!title || !description){
  throw new ApiError(400, "Title and Description are required")
}
const videoPath = req.files?.videoFile[0].path
const thumbnailPath = req.files?.thumbnail[0].path
if(!videoPath || !thumbnailPath){
  throw new ApiError(400, "Video & Thumbnail Files are Required! ")
}

const videoResponse = await uploadOnCloudinary(videoPath)
const thumbnailResponse = await uploadOnCloudinary(thumbnailPath)
if(!videoResponse){
  throw new ApiError(500, "Video file upload failed! ")
}
if(!thumbnailResponse){
  throw new ApiError(500, "Thumbnail Upload Failed! ")
}

const video = Video.create({
  title,
  description,
  owner: req.user?._id,
  duration: videoResponse?.duration,
  videoFile: videoResponse?.url,
  thumbnail: thumbnailResponse?.url,
  isPublished: req.body?.isPublished || true ,
  
})
if(!video){
  throw new ApiError(500, "Video Upload on mongoDB Failed")
}

return res.status(200).json(new ApiResponse(200, video, "Video uploaded and saved successfully!"))

});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId)

if(!video){
  throw new ApiError(404, "Video not found")
}
return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully! "))

});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const {title, description} = req.body
  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid Video ID")
  }
  const video = await Video.findByIdAndUpdate(videoId, {
    $set: {
      thumbnail: req.file?.path,
      title,
      description,
    }
  },{new: true})
  //TODO: update video details like title, description, thumbnail
  if(!video){
    throw new ApiError(500, "Failed to update video")
  }
  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully! "))
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video



const deleteVideo = await Video.findByIdAndDelete(videoId)

if(!deleteVideo){
  throw new ApiError(500, "Failed to delete video")
}
return res.status(200).json(new ApiResponse(200, deleteVideo, "Video deleted successfully! "))
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
const video = await Video.findByIdAndUpdate(videoId,{
  $set: {
    isPublished: !video.isPublished
  }
},{new: true})

})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
