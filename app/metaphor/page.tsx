"use client"

import ExpandableCardDemo from "@/components/expandable-card-demo-standard"
import { PlusIcon, Sparkles } from "lucide-react"
import { SetStateAction, useEffect, useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "motion/react"
import { handleAgent } from "@/actions/agentRunner"
import { getMetaphorsOfUser } from "@/actions/crud"

function Page() {
  const [searchValue, setSearchValue] = useState("")
  const [dialogInput, setDialogInput] = useState("")
  const [isPending,startTransition] = useTransition()
  const [data,setData] = useState<any>(metaphorContent)


  useEffect(()=>{
    const get = async()=>{
      const res = await getMetaphorsOfUser("abc123")
      console.log(res)
      if(!res) return
      const dt = res?.map((v)=>{
        return { 
            _id:v._id,
  algoTitle:v.algoTitle,
  algoSteps:v.algoSteps,
  metaphorName:v.metaphorName,
  metaphorDesc:v.metaphorDesc,
  src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuLyGp6AP-CnvQ30G3T6nRAuD4xxpZSvcUFw&s",
  userId:v.userId,
        }
      })
      setData(dt)
    }
    get()
  },[])

  const handleSubmit = async (userPrompt:string)=>{
   console.log("Submitting")
   setDialogInput("")
  const res = await handleAgent(userPrompt)
  if(!res) return
  setData((p: any)=>[res,...p])
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Metaphor Flash Cards
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Transform complex concepts into memorable metaphors with AI-powered learning cards
          </p>
        </motion.div>

        {/* Search and Add Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 px-4 py-3 focus:outline-none text-lg"
              placeholder="Search your metaphor cards..."
            />

            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <PlusIcon className="w-5 h-5" />
                </motion.button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Create New Metaphor Card
                  </DialogTitle>
                  <DialogDescription className="text-slate-600 dark:text-slate-400">
                    Describe the concept you'd like to turn into a memorable metaphor
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Concept Description
                    </label>
                    <textarea
                      value={dialogInput}
                      onChange={(e) => setDialogInput(e.target.value)}
                      className="w-full min-h-[100px] p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none"
                      placeholder="e.g., Explain how neural networks learn patterns..."
                      rows={4}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!dialogInput.trim()}
                    onClick={()=>handleSubmit(dialogInput)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Generate Metaphor Card
                    </span>
                  </motion.button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ExpandableCardDemo metaphorContent={data}/>
        </motion.div>
      </div>
    </div>
  )
}

export default Page

const metaphorContent:Content[] = [
  {
    _id:"1",
  algoTitle:"Bubble Sort",
  algoSteps:"Step1 Sort array, shift left, find max",
  metaphorName: "Bucket of Water",
  metaphorDesc:"Imagine you have a bucket of water it has many balls...",
  src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuLyGp6AP-CnvQ30G3T6nRAuD4xxpZSvcUFw&s",
  userId:""
},
  {
    _id:"2",
  algoTitle:"Bubble Sort",
  algoSteps:"Step1 Sort array, shift left, find max",
  metaphorName: "Bucket of Water",
  metaphorDesc:"Imagine you have a bucket of water it has many balls...",
  src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuLyGp6AP-CnvQ30G3T6nRAuD4xxpZSvcUFw&s",
  userId:""
},
  {
    _id:"3",
  algoTitle:"Bubble Sort",
  algoSteps:"Step1 Sort array, shift left, find max",
  metaphorName: "Bucket of Water",
  metaphorDesc:"Imagine you have a bucket of water it has many balls...",
  src:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuLyGp6AP-CnvQ30G3T6nRAuD4xxpZSvcUFw&s",
  userId:""
},
]