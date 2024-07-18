import React from "react"

export const metadata = {
    title: 'Profile | Bloomify',
    description: 'NextJS template with TypeScript, TailwindCSS, and MongoDB, created by @clipper.',
  }

const layout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
};

export default layout