"use client";
import './globals.css';
import Navbar from '@/components/nav/Navbar';
import Sidebar from '@/components/nav/Sidebar';


// export const metadata = {
//   title: 'NextJS template with TypeScript, TailwindCSS, and MongoDB',
//   description: 'NextJS template with TypeScript, TailwindCSS, and MongoDB, created by @clipper.',
// }
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { RecoilRoot } from 'recoil';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <RecoilRoot>
          <body className='bg-gray-50 w-full h-screen overflow-clip flex flex-col'>
            <Navbar />
            <main className='w-full h-full flex flex-col md:flex-row'>
              <Sidebar />
              <div className='w-full md:pr-32 mt-12 mb-16 overflow-auto'>{children}</div>
            </main>
          </body>
        </RecoilRoot>
      </UserProvider>
      
    </html>
  )
}
