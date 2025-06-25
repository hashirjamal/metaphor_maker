"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ArrowLeftCircle, ArrowRightCircle, MoveLeftIcon, MoveRightIcon, XIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { handleAgent } from "@/actions/agentRunner";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInDb } from "@/actions/crud";



export default function ExpandableCardDemo({ metaphorContent }: {
  metaphorContent: Content[]
}) {
  const [active, setActive] = useState<any>(
    null
  );

  const [currentModalSec, setCurrentModalSec] = useState<Number>(1)
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const user = useUser()?.user

  const queryClient = useQueryClient()

  const handleRegenerate = async ({ algoTitle, metaphorName, objectId }: UpdatePayload) => {
    console.log(`Previosuly you made the metaphor named ${metaphorName} for ${algoTitle} so regenerate it`)
    const regenPrompt = `Previosuly you made the metaphor named ${metaphorName} for ${algoTitle} so regenerate it`
    await handleAgent(regenPrompt, user?.id, objectId)
  }

  const { mutate: regenMutation, isPending: isRegenerating, isError: regenError } = useMutation({
    mutationFn: handleRegenerate,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['metaphors']
      })
      setActive(null)
    },
    onError: async (e) => {
      console.log(e)

    }
  })


  const {
    mutate: handleDelete,
    isPending,
    isError
  } = useMutation({
    mutationFn: async (objectId: string) => {
      await deleteInDb(objectId)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['metaphors']
      })
      setActive(null)

    },
    onError: async (e) => {
      console.log(e)

    }
  })

  useEffect(() => {
    console.log(metaphorContent)
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] bg-black/40 backdrop-blur-sm">
            {/* Close Button */}
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-neutral-700 transition lg:hidden"
              onClick={() => setActive(null)}
            >
              <XIcon className="w-4 h-4" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 flex flex-col gap-4 overflow-y-auto max-h-[90vh]"
            >
              <span className="flex justify-between gap-2">
                <button disabled={currentModalSec == 1} onClick={() => setCurrentModalSec(1)}><ArrowLeftCircle className="h-6 w-6  " /></button>
                <button disabled={currentModalSec == 2} onClick={() => setCurrentModalSec(2)}><ArrowRightCircle className="h-6 w-6" /> </button>
              </span>
              {isPending && <p>Deleting this metaphor...</p>}
              {isError && <p>Error while deleting this metaphor...</p>}
              {isRegenerating && <p>Regenerating metaphor...</p>}
              {regenError && <p>Error while regenerating metaphor...</p>}
              {/* Algorithm Section */}
              {currentModalSec == 1 ? <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1">
                  Algorithm
                </h3>
                <h4 className="text-md font-medium text-neutral-700 dark:text-neutral-200">
                  {active.algoTitle}
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {active.algoSteps}
                </p>
              </div> : null}


              {/* Metaphor Section */}
              {currentModalSec == 2 ? <div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1">
                  Metaphor
                </h3>
                <motion.h4
                  layoutId={`title-${active.title}-${id}`}
                  className="text-md font-medium text-neutral-700 dark:text-neutral-200"
                >
                  {active.metaphorName}
                </motion.h4>
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="text-sm text-neutral-600 dark:text-neutral-400 mt-1"
                >
                  {active.metaphorDesc}
                </motion.p>
              </div> : null}

              {/* Regenerate and Delete Button */}
              <div className="flex gap-2">

                <motion.a
                  layoutId={`regenerate-button-${active.title}-${id}`}
                  onClick={() => regenMutation({ algoTitle: active.algoTitle, metaphorName: active.metaphorName, objectId: active._id })}
                  target="_blank"
                  className="self-start mt-2 cursor-pointer inline-block px-5 py-2 text-sm font-semibold rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 transition"
                >
                  Regenerate
                </motion.a>
                <motion.a
                  layoutId={`delete-button-${active.title}-${id}`}
                  onClick={() => handleDelete(active._id)}
                  target="_blank"
                  className="self-start mt-2 cursor-pointer inline-block px-5 py-2 text-sm font-semibold rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 transition"
                >
                  Delete
                </motion.a>
              </div>
            </motion.div>
          </div>
        ) : null}

      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-14">


        {metaphorContent?.map((card, index) => {
          if (!card) return
          return (
            <motion.div
              key={card._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group my-4 cursor-pointer "
              onClick={() => setActive(card)}
            >
              <Card className="h-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img src={card.src} alt="" className="h-16 w-20 rounded-md object-cover" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">
                          {card.algoTitle}
                        </h3>

                      </div>
                    </div>

                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-100 dark:border-blue-800/30">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Metaphor:</p>
                      <p className="text-blue-700 dark:text-blue-200 font-medium">{card.metaphorName}</p>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{card.metaphorDesc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Lana Del Rey",
    title: "Summertime Sadness",
    src: "https://assets.aceternity.com/demos/lana-del-rey.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Lana Del Rey, an iconic American singer-songwriter, is celebrated for
          her melancholic and cinematic music style. Born Elizabeth Woolridge
          Grant in New York City, she has captivated audiences worldwide with
          her haunting voice and introspective lyrics. <br /> <br /> Her songs
          often explore themes of tragic romance, glamour, and melancholia,
          drawing inspiration from both contemporary and vintage pop culture.
          With a career that has seen numerous critically acclaimed albums, Lana
          Del Rey has established herself as a unique and influential figure in
          the music industry, earning a dedicated fan base and numerous
          accolades.
        </p>
      );
    },
  },
  {
    description: "Babbu Maan",
    title: "Mitran Di Chhatri",
    metaphor: "",
    src: "https://assets.aceternity.com/demos/babbu-maan.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Babu Maan, a legendary Punjabi singer, is renowned for his soulful
          voice and profound lyrics that resonate deeply with his audience. Born
          in the village of Khant Maanpur in Punjab, India, he has become a
          cultural icon in the Punjabi music industry. <br /> <br /> His songs
          often reflect the struggles and triumphs of everyday life, capturing
          the essence of Punjabi culture and traditions. With a career spanning
          over two decades, Babu Maan has released numerous hit albums and
          singles that have garnered him a massive fan following both in India
          and abroad.
        </p>
      );
    },
  },

  {
    description: "Metallica",
    title: "For Whom The Bell Tolls",
    src: "https://assets.aceternity.com/demos/metallica.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Metallica, an iconic American heavy metal band, is renowned for their
          powerful sound and intense performances that resonate deeply with
          their audience. Formed in Los Angeles, California, they have become a
          cultural icon in the heavy metal music industry. <br /> <br /> Their
          songs often reflect themes of aggression, social issues, and personal
          struggles, capturing the essence of the heavy metal genre. With a
          career spanning over four decades, Metallica has released numerous hit
          albums and singles that have garnered them a massive fan following
          both in the United States and abroad.
        </p>
      );
    },
  },
  {
    description: "Led Zeppelin",
    title: "Stairway To Heaven",
    src: "https://assets.aceternity.com/demos/led-zeppelin.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          Led Zeppelin, a legendary British rock band, is renowned for their
          innovative sound and profound impact on the music industry. Formed in
          London in 1968, they have become a cultural icon in the rock music
          world. <br /> <br /> Their songs often reflect a blend of blues, hard
          rock, and folk music, capturing the essence of the 1970s rock era.
          With a career spanning over a decade, Led Zeppelin has released
          numerous hit albums and singles that have garnered them a massive fan
          following both in the United Kingdom and abroad.
        </p>
      );
    },
  },
  {
    description: "Mustafa Zahid",
    title: "Toh Phir Aao",
    src: "https://assets.aceternity.com/demos/toh-phir-aao.jpeg",
    ctaText: "Play",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <p>
          &quot;Aawarapan&quot;, a Bollywood movie starring Emraan Hashmi, is
          renowned for its intense storyline and powerful performances. Directed
          by Mohit Suri, the film has become a significant work in the Indian
          film industry. <br /> <br /> The movie explores themes of love,
          redemption, and sacrifice, capturing the essence of human emotions and
          relationships. With a gripping narrative and memorable music,
          &quot;Aawarapan&quot; has garnered a massive fan following both in
          India and abroad, solidifying Emraan Hashmi&apos;s status as a
          versatile actor.
        </p>
      );
    },
  },
];
