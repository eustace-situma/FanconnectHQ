import mongoose, { Schema, models, model } from 'mongoose'

const playerSchema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true }
  },
  { _id: false }
)

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    league: { type: String, required: true },
    players: { type: [playerSchema], default: [] }
  },
  {
    timestamps: true
  }
)

export default models.Team || model('Team', teamSchema)
