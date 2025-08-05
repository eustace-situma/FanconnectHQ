import mongoose, { Schema, model, models } from 'mongoose'

// Define inline to avoid "Cannot find name 'playerSchema'" error
const playerSchema = new Schema(
  {
    name: String,
    position: String,
  },
  { _id: false }
)

const gameSchema = new Schema(
  {
    league: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    homePlayers: { type: [playerSchema], default: [] },
    awayPlayers: { type: [playerSchema], default: [] },
    gameDate: { type: String, required: true },
    gameTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'finished'],
      default: 'upcoming',
    },
    // ✅ Add FT scores here
    homeScore: { type: Number },
    awayScore: { type: Number },
    // ✅ new hot flag
    hot: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default models.Game || model('Game', gameSchema)
