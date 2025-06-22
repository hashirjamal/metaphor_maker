"use server"
import { connectToDatabase } from '@/lib/mongoose';  // your connection util
import { MetaphorModel } from '@/model';          // your model

export async function saveMetaphorInDb(payload: Content) {

  try {
    await connectToDatabase();  // ensures DB connection
    const newMetaphor = new MetaphorModel(
      {
        ...payload
      }
    )
    await newMetaphor.save()
  }
  catch (e) {
    console.log(e)
  }
}


export async function getMetaphorsOfUser(userId: string | undefined) {
  try {
    if (!userId) return
    await connectToDatabase()
    const metaphors = await MetaphorModel.find({ userId }).lean()
    return metaphors
  }
  catch (e) {
    console.log(e)
  }
}


