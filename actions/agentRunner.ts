"use server"

import { uploadBufferToCloudinary } from "@/lib/saveImage";
import { generateAlgoProfile, generateImageFromAlgorithmMetaphor, generateMetaphor } from "../lib/ai_agent"
import { saveMetaphorInDb, updateMetaphorInDb } from "./crud"
import { generateImage } from "./imageGen"
import fs from 'fs';

export const handleAgent = async (userPrompt: string, userId: string | null | undefined, objectId: string | null = null): Promise<Content | undefined> => {
   try {
      if (!userId) return
      console.log("Running agent")
      const algoProfile = await generateAlgoProfile({ userPrompt })
      const metaphorContent = await generateMetaphor({ algoProfile })
      // const imgUrl = await generateImageFromAlgorithmMetaphor({
      //    algorithmName: metaphorContent.algorithm.name,
      //    metaphorDescription: metaphorContent.metaphor.desc
      // })

      let base64Data = await generateImage(metaphorContent.metaphor.name)

      const buffer = Buffer.from(base64Data, 'base64');

      const imgUrl = await uploadBufferToCloudinary(buffer)
      console.log(imgUrl)
      let metaphorObj: Content = {
         algoTitle: metaphorContent.algorithm.name,
         algoSteps: metaphorContent.algorithm.steps,
         metaphorName: metaphorContent.metaphor.name,
         metaphorDesc: metaphorContent.metaphor.desc,
         src: imgUrl,
         userId

      }

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
      console.log(e)
   }
}

