import React from 'react'
import TrackingPageDropDown from '@/app/components/TrackingPageDropDown'
const page = () => {
  return (
 <main className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">BudgetWise</h1>
        <TrackingPageDropDown/>
        <div className="text-muted-foreground mt-8">
          Select a workspace and page to begin tracking your transactions.
        </div>
      </div>
    </main>  )
}

export default page