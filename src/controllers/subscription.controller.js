import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
        // TODO: toggle subscription
    const {channelId} = req.params
    const {_id} = req.user
    const subscription = await Subscription.findOneAndUpdate({channel: channelId, subscriber: _id})
    if(!subscription){
        const newSubscription = await Subscription.create({
            channel: channelId,
            subscriber: _id
        })
        if(!newSubscription){
            throw new ApiError(400, "Subscription failed")
        }
        return res.status(200).json(new ApiResponse(200, "Subscribed successfully"))
    }
    else{
       const unsubscribe =  await Subscription.deleteOne({channel: channelId, subscriber: _id})
         if(!unsubscribe){
              throw new ApiError(400, "Unsubscription failed")
         }
         return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"))

    }


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribers = await Subscription.countDocuments({channel: channelId},function(err,count){
if(!count){
    throw new ApiError(400, "No subscribers found")
}
return res.status(200).json(new ApiResponse(200, count, "Subscribers Fetched Successfully!")) 
    })
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const subscribedChannels = await Subscription.countDocuments({subscriber: subscriberId},function(err,count){
        if(!count){
            throw new ApiError(400, "No subscribed channels found")
        }
        return res.status(200).json(new ApiResponse(200, count, "Subscribed Channels Fetched Successfully!")) 
            }
    })
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}