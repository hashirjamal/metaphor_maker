import ExpandableCardDemo from '@/components/expandable-card-demo-standard'
import { PlusIcon, Search } from 'lucide-react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AnimatePresence, motion } from "motion/react";

function page() {
  return (
   <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center px-4 py-10 gap-10">
  <h1 className="text-3xl sm:text-5xl font-bold text-center text-gray-800 dark:text-gray-100">
    Metaphor Flash Cards
  </h1>

  <div className="w-full sm:w-2/3 flex flex-row sm:gap-4 gap-2">
    <input type='text'
      
      className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 resize-none"
      placeholder="Enter a sentence or topic..."
    />
<Dialog>
  <DialogTrigger asChild><button
      className="w-15   bg-gray-700 my-1  dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white rounded-full shadow-sm flex items-center justify-center"
    >
      <PlusIcon className="w-5 h-5" />
    </button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Generate Metaphors</DialogTitle>
      <DialogDescription>
        Mention the Name and Description of the algorithm
      </DialogDescription>
    </DialogHeader>

    <textarea name="" id="" className=" border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 resize-none "
      placeholder="Enter a sentence or topic..." rows={3}></textarea>
    <button
              
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-gray-500 hover:text-white text-black mt-4 md:mt-0"
            >
              Generate 
            </button>
  </DialogContent>
</Dialog>
    
  </div>
  <ExpandableCardDemo />
</div>


  )
}

export default page