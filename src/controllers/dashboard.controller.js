import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {_id} = req.user

    const user = await User.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "_id", 
                foreignField: "owner",
                as: "videos",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            totalViews: {$sum: "$views"},
                            totalLikes: {$sum: "$likes"},
                            totalDislikes: {$sum: "$dislikes"},
                            totalComments: {$sum: "$comments"},
                            totalVideos: {$sum: 1}
                        }
                    },
                    {
                        as: "videos"
                    },
                    {
                        $unwind: "$videos"
                    }
                ]
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField: "_id", 
                foreignField: "channel",
                as: "subscribers",
            }
        }
        
    ])

    if(!user){
        throw new ApiError(404, "User not found")
    }
    return res.status(200).json(new ApiResponse(200, user, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

const {_id} = req.user
const videos = await Video.aggregate([
    {
        $match: {
            owner: mongoose.Types.ObjectId(_id)
        }
    }
])
if(!videos){
    throw new ApiError(404, "Videos not found")
}
return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"))

})

export {
    getChannelStats, 
    getChannelVideos
    }