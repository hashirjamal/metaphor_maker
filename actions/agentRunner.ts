"use server"

import { randomUUID } from "crypto"
import { generateAlgoProfile, generateMetaphor } from "../lib/ai_agent"
import { insertDummyContent } from "./crud"

export const handleAgent = async (userPrompt: string): Promise<Content | undefined> => {
   try {
      console.log("Running agent")
      const algoProfile = await generateAlgoProfile({ userPrompt })
      const metaphorContent = await generateMetaphor({ algoProfile })
      console.log(metaphorContent)
      let obj = {
         id: randomUUID(),

         algoTitle: metaphorContent.algorithm.name,
         algoSteps: metaphorContent.algorithm.steps,
         metaphorName: metaphorContent.metaphor.name,
         metaphorDesc: metaphorContent.metaphor.desc,
         src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuLyGp6AP-CnvQ30G3T6nRAuD4xxpZSvcUFw&s"

      }

      await insertDummyContent()
      return obj



   } catch (e) {
      console.log(e)
   }
}

