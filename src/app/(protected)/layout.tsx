import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { UserButton } from '@clerk/nextjs'

type Props = {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <main className='w-full m-2'>
        <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4'>
          {/* You can add additional components like a SearchBar if needed */}
          <div className='ml-auto'></div>
          <UserButton />
          </div>
          {/* main content */}
          <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4'>
            {children}

          </div>
        
        
      </main>
    </SidebarProvider>
  )
}

export default SidebarLayout
