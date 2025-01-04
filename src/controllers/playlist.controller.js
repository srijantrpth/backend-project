import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }
  //TODO: create playlist
  const playlist = await Playlist.create({
    name,
    description,
  });
  if (!playlist) {
    throw new ApiError(500, "Failed to create playlist");
  }
  res.status(201).json(new ApiResponse(201, { playlist }));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  const userPlaylist = await Playlist.findOne({
    owner: userId,
  });
  if (!userPlaylist) {
    throw new ApiError(404, "No playlist found");
  }
  return res.status(200).json(new ApiResponse(200, { userPlaylist }));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const playlist = await Playlist.findOne({ _id: playlistId });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res.status(200).json(new ApiResponse(200, { playlist }));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findByIdAndUpdate(playlistId, {
    $push: { videos: videoId },
  });
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res.status(200).json(new ApiResponse(200, { playlist }));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  const removeVideo = await Playlist.findByIdAndUpdate(playlistId, {
    $pull: { videos: videoId },
  });
  if (!removeVideo) {
    throw new ApiError(404, "Video not found");
  }
  return res.status(200).json(new ApiResponse(200, { removeVideo }));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  const deletedPlaylist = await Playlist.deleteOne({ _id: playlistId });
    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
    $set: {
        name,
        description,
    }
  })
    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(new ApiResponse(200, updatedPlaylist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
