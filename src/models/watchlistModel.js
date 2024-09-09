// models/watchlistModel.js
import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  animeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const Watchlist = mongoose.models.watchlists || mongoose.model('watchlists', watchlistSchema);
export default Watchlist;