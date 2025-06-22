"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex  items-center justify-center bg-white dark:bg-black px-4 py-12">
            <SignIn
                routing="hash"
                appearance={{
                    elements: {
                        // Main card styling
                        card:
                            "bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl",

                        // Primary button styling
                        formButtonPrimary:
                            "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-medium rounded-lg transition duration-300",

                        // Input fields
                        formFieldInput:
                            "bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500",

                        // Label text
                        formFieldLabel:
                            "text-gray-700 dark:text-gray-300 text-sm font-medium",

                        // Optional hint or helper text
                        formFieldWarningText:
                            "text-red-500 dark:text-red-400 text-xs mt-1",

                        // Divider between social buttons and form
                        dividerText:
                            "text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wider",

                        // Footer, like "Don't have an account?"
                        footerActionText:
                            "text-gray-600 dark:text-gray-400",
                        footerActionLink:
                            "text-blue-600 dark:text-blue-400 hover:underline",

                        // Social login buttons (e.g., Google)
                        socialButtonsBlockButton:
                            "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition duration-300",
                    },
                }}
            />
        </div>
    );
}
