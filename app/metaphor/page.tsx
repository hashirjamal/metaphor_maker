"use client"

import ExpandableCardDemo from "@/components/expandable-card-demo-standard"
import { PlusIcon, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "motion/react"
import { handleAgent } from "@/actions/agentRunner"
import { getMetaphorsOfUser } from "@/actions/crud"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CardSkeleton } from "@/components/composites/SkeletonCard"
import { checkRateLimit } from "@/actions/rateLimit"
import { randomUUID } from "crypto"
import { errorLog } from "@/lib/utils"
import { toast } from "sonner"


function Page() {
  const [searchValue, setSearchValue] = useState("")
  const [dialogInput, setDialogInput] = useState("")
  const [data, setData] = useState<any>([])

  const user = useUser()?.user






  const get = async (): Promise<Content[]> => {
    // const res = await getMetaphorsOfUser(user?.id)
    const res = await getMetaphorsOfUser(user?.id || sessionStorage.getItem("user") || undefined)
    if (!res) throw new Error("Something went wrong")
    let dt = res?.map((v) => {
      return {
        _id: v._id,
        algoTitle: v.algoTitle,
        algoSteps: v.algoSteps,
        metaphorName: v?.metaphorName,
        metaphorDesc: v?.metaphorDesc,
        src: v.src,
        userId: v.userId,
        createdAt: v.createdAt
      }
    })
    dt = dt.sort((a: any, b: any) => Number(b.createdAt > a.createdAt) - 1) //  sorting in descending order of date 

    return dt
  }


  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['metaphors'],
    queryFn: get
  })



  const checkLimitAndHandleAgent = async (userPrompt: string) => {
    let paywallCheck;
    // new logic : if user does not exist then check if theres a random uuid in session storage then send it as user id else create one and store there
    if (user?.id) {
      if (!await checkRateLimit(user.id)) throw new Error("Daily Limit Reached")
      return await handleAgent(userPrompt, user?.id)

    }
    else {
      let userInSession = sessionStorage.getItem("user")
      if (!userInSession) {
        userInSession = crypto.randomUUID()
        sessionStorage.setItem("user", userInSession)
      } else {
        if (!await checkRateLimit(userInSession)) throw new Error("Daily Limit Reached")
      }
      return await handleAgent(userPrompt, userInSession)
    }

  }


  const {
    mutate,
    data: mutationData,
    isPending
  } = useMutation({
    mutationFn: async (userPrompt: string) => await checkLimitAndHandleAgent(userPrompt)
    ,
    onSuccess: async (result) => {
      toast("Metaphor generated successfully")
      setDialogInput("")
      queryClient.invalidateQueries({
        queryKey: ['metaphors']
      })
    },
    onError: async (e) => {
      setDialogInput("")
      errorLog(e)
      toast(e.message || "Limit reached")
    }
  }
  )

  useEffect(() => {
    setData(query?.data)
  }, [query?.data])
  const handleSearch = (searchStr: string) => {
    setSearchValue(searchStr);

    const filtered = query?.data?.filter((v, i) => {
      return v.algoTitle.toLowerCase().includes(searchStr.toLowerCase()) || v?.metaphorName.toLowerCase().includes(searchStr.toLowerCase())
    })
    setData(filtered)

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
        {!user ? <p className="text-center my-4 text-gray-600">You are not logged in, your flashcards can not be saved</p> : null}
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
              onChange={(e) => handleSearch(e.target.value)}
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
                      onKeyDown={(e) => {
                        if (e.ctrlKey && e.key === "Enter" && dialogInput.trim()) {
                          e.preventDefault(); // Prevents newline insertion
                          mutate(dialogInput);
                        }
                      }}
                      onChange={(e) => setDialogInput(e.target.value)}
                      className="w-full min-h-[100px] p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 resize-none"
                      placeholder="e.g., Explain how neural networks learn patterns..."
                      rows={4}
                    />
                  </div>
                  <DialogClose asChild>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!dialogInput.trim()}
                      onClick={() => mutate(dialogInput)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Generate Metaphor Card
                      </span>
                    </motion.button>
                  </DialogClose>
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
          {isPending && <CardSkeleton />}
          {query.data ? <ExpandableCardDemo metaphorContent={data} /> :

            <p className="text-center">No Metaphors to display...</p>
          }
        </motion.div>
      </div>
    </div>
  )
}

export default Page

