// import the Genkit and Google AI plugin libraries
import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';


// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.0-flash'), // set default model
});



const profileSchema = z.object({
  name: z.string().describe("Name of Algorithm"),
  category: z.string().describe("The Category which the algorithm belongs to"),
  core_principle: z.string().describe("Fundamental Principles of Algorithm"),
  data_structure: z.string().describe("Data Structure that is being used in the algorithm"),
  key_actions: z.string().describe("Key Steps being performed in the algorithm"),
  complexity_feel: z.string().describe("Complexity Feel of the Algorithm"),
  analogy_keywords: z.string().describe("Keywords to remember for analogy of algorithm")
})

export const generateAlgoProfile = ai.defineFlow({
  name: "generateAlgoProfile",
  inputSchema: z.object({
    userPrompt: z.string().describe("Name or user's POV of algorithm")
  }),
  outputSchema: profileSchema
},
  async ({ userPrompt }:{userPrompt:string}) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: `Make an algorithm profile for the algoritm mentioned by user. User Prompt : ${userPrompt}`,
      output: { schema: profileSchema }
    });
    if (!output) throw new Error("Gemini Error while making profile")
    return output
  })

const metaphorSchema = z.object({
  algorithm: z.object({
    name: z.string(),
    steps: z.string()
  }),
  metaphor: z.object({
    name: z.string(),
    desc: z.string()
  })
},
)

export const generateMetaphor = ai.defineFlow({
  name: "generateMetaphor",
  inputSchema: z.object({
    algoProfile: profileSchema
  }),
  outputSchema: metaphorSchema,
},
  async ({ algoProfile }:{algoProfile:any}) => {
    const profile = JSON.stringify(algoProfile)
    const { output } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: `Generate a metaphor for the algorithm with given profile ${profile}`,
      output: {
        schema: z.object({
          name: z.string(),
          desc: z.string()
        })
      }
    })
    if(!output) throw new Error("Error While generating metaphors")
    return {
      algorithm: {
        name: algoProfile.name,
        steps: algoProfile.key_actions,
      },
      metaphor: output
    }
  }

)