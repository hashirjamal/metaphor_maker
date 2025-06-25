"use server"

import { uploadBufferToCloudinary } from "@/lib/saveImage";
import { generateAlgoProfile, generateImageFromAlgorithmMetaphor, generateMetaphor } from "../lib/ai_agent"
import { saveMetaphorInDb, updateMetaphorInDb } from "./crud"
import { generateImage } from "./imageGen"
import { randomUUID } from "crypto";


export const handleAgent = async (userPrompt: string, userId: string | null | undefined, objectId: string | null = null): Promise<Content | undefined> => {
   try {

      console.log("Running agent")
      const algoProfile = await generateAlgoProfile({ userPrompt })
      const metaphorContent = await generateMetaphor({ algoProfile })
      // const imgUrl = await generateImageFromAlgorithmMetaphor({
      //    algorithmName: metaphorContent.algorithm.name,
      //    metaphorDescription: metaphorContent.metaphor.desc
      // })
      console.log(metaphorContent)
      let base64Data = await generateImage(metaphorContent.metaphor.name)

      const buffer = Buffer.from(base64Data, 'base64');

      const imgUrl = await uploadBufferToCloudinary(buffer)
      console.log(imgUrl)
      let metaphorObj: Content = {
         _id: randomUUID(),
         algoTitle: metaphorContent.algorithm.name,
         algoSteps: metaphorContent.algorithm.steps,
         metaphorName: metaphorContent.metaphor.name,
         metaphorDesc: metaphorContent.metaphor.desc,
         src: imgUrl,
         userId: userId || ""

      }
      if (!userId) return metaphorObj

      if (objectId) {
         updateMetaphorInDb(metaphorObj, objectId)
      }
      else {
         await saveMetaphorInDb(metaphorObj)
      }

      return {
         ...metaphorObj
      }



   } catch (e) {
      console.log(e, "Error in agent runner")
   }
}

