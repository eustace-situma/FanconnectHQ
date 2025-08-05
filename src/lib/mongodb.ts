import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable')
}

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectToDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    throw new Error('Failed to connect to MongoDB')
  }
}

if (process.env.NODE_ENV !== 'production') {
  ;(global as any).mongoose = cached
}
