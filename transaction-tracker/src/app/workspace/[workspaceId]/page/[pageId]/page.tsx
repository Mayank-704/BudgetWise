"use client"


import TrackingTable from "@/app/components/TrackingTable";
import BarChart from "@/app/components/BarChart";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";

// Simple Modal component
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-lg w-full relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { workspaceId, pageId } = params as { workspaceId: string; pageId: string };
  const setWorkspaceId = useAppStore((s) => s.setWorkspaceId);
  const setPageId = useAppStore((s) => s.setPageId);
  const [modalOpen, setModalOpen] = useState(false);

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
    <main className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Tracking Table Section */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 md:p-10 min-w-0 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Transactions</h2>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 shadow transition-all duration-200"
                  onClick={() => setModalOpen(true)}
                  aria-label="Show Analytics"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 17V9m4 8V5m4 12v-6" />
                  </svg>
                  <span className="hidden sm:inline">Analytics</span>
                </button>
              </div>
              <TrackingTable />
            </div>
          </div>

          {/* BarChart is now only shown in modal, not on any device */}
        </div>
      </div>
      {/* Modal for BarChart on mobile */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100 text-center">Analytics</h2>
        <BarChart />
      </Modal>
    </main>
  );
}
