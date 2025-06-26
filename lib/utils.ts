import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const errorLog = (e: any) => {
  if (e instanceof Error) {
    if (process.env.ENVIRONMENT == 'production') { console.log(e.message) }
    else {
      console.log(e)
    }
  }

}
