
import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema({
  episodeNo: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  episodes: [episodeSchema],
});



const Series = mongoose.models.series || mongoose.model("series",seriesSchema)

export default Series;