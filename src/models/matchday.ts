// /src/models/matchday.ts
import mongoose, { Schema, model, models } from 'mongoose'

const matchdaySchema = new Schema(
  {
    gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    ratings: { type: Map, of: Number }, // e.g. { "Salah": 8, "Haaland": 6 }
    momVote: { type: String, required: true },
  },
  { timestamps: true }
)

export default models.Matchday || model('Matchday', matchdaySchema)
