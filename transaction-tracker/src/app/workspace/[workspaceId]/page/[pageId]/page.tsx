"use client"

import TrackingTable from "@/app/components/TrackingTable";
import BarChart from "@/app/components/BarChart";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { workspaceId, pageId } = params as { workspaceId: string; pageId: string };
  const setWorkspaceId = useAppStore((s) => s.setWorkspaceId);
  const setPageId = useAppStore((s) => s.setPageId);

  // Sync Zustand store with URL params
  useEffect(() => {
    setWorkspaceId(workspaceId);
    setPageId(pageId);
  }, [workspaceId, pageId, setWorkspaceId, setPageId]);

  // If params are missing, redirect to home
  useEffect(() => {
    if (!workspaceId || !pageId) router.push("/");
  }, [workspaceId, pageId, router]);

  return (
    <main className="flex min-h-screen">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="flex-1">
            <TrackingTable />
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <BarChart />
          </div>
        </div>
    </main>
  );
}
