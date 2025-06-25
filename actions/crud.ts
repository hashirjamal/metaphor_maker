"use server"
import { connectToDatabase } from '@/lib/mongooseConn';  // your connection util
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
export async function updateMetaphorInDb(payload: Content, _id: string) {
  try {
    await connectToDatabase(); // ensures DB connection

    await MetaphorModel.findByIdAndUpdate(
      _id,
      { ...payload }
    );
  } catch (e) {
    console.log(e);
  }
}
export async function deleteInDb(_id: string) {
  try {
    await connectToDatabase(); // ensures DB connection

    await MetaphorModel.deleteOne({
      _id
    })
  } catch (e) {
    console.log(e);
  }
}



export async function getMetaphorsOfUser(userId: string | undefined) {
  try {
    if (!userId) return
    await connectToDatabase()
    const metaphors = await MetaphorModel.find({ userId }).lean()
    const serialized = metaphors.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt?.toISOString?.() ?? null,
      updatedAt: item.updatedAt?.toISOString?.() ?? null,
    }))

    return serialized
  }
  catch (e) {
    console.log(e)
  }
}


