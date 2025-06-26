import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import ReactQueryProvider from '@/components/provider/ReactQueryProvider'
import Link from 'next/link'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Metaphor Maker',
  description: 'Create and Save Metaphors for programming algorithms',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <ClerkProvider

    >
      <html lang="en" className='dark'>
        <ReactQueryProvider>


          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <header className="flex  justify-between items-center p-4  h-16 bg-transparent">
              <Link href={"/"} className='text-xl font-bold'>
                Metaphor maker
              </Link>
              <div className='flex flex-1 justify-end gap-4'>

                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            <Toaster />
            {children}
          </body>

        </ReactQueryProvider>
      </html>
    </ClerkProvider>
  )
}