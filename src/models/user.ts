import mongoose, { Schema, Document, models, model } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  isVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  createdAt: Date
}

const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default models.User || model<IUser>('User', UserSchema)
