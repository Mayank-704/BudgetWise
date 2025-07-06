'use client'
import WorkspaceDropdown from "./components/WorkspaceDropdown";

// import { useRouter } from "next/navigation";
// import { useAppStore } from "@/lib/store";
// import { useEffect } from "react";

export default function Home() {
  // const router = useRouter();
  // const workspaceId = useAppStore((s) => s.selectedWorkspaceId);
  // const pageId = useAppStore((s) => s.selectedPageId);

  // // If both selected, redirect to tracking page
  // useEffect(() => {
  //   if (workspaceId && pageId) {
  //     router.push(`/workspace/${workspaceId}/page/${pageId}`);
  //   }
  // }, [workspaceId, pageId, router]);

  return (
    <main className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">BudgetWise</h1>
        <WorkspaceDropdown />
        <div className="text-muted-foreground mt-8">
          Select a workspace and page to begin tracking your transactions.
        </div>
      </div>
    </main>
  );
}