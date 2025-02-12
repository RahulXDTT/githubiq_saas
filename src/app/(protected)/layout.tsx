import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

type Props = {
    children : React.ReactNode
}

const SidebarLayout = () => {
  return (
    <SidebarLayout>
        <main className='w-full m-2'>
            <div className=' flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4'>

            </div>
        </main>
    </SidebarLayout>
  )
}

export default SidebarLayout