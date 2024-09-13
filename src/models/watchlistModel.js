
import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  videoType: {
    type: String,
    enum: ['series', 'movies'],
    required: true,
  },
});

const Watchlist =  mongoose.models.watchlists|| mongoose.model('watchlists', watchlistSchema);

export default Watchlist
