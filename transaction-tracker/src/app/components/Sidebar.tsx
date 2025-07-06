// Sidebar.tsx
// Sidebar for workspace/pages navigation
"use client"
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Workspace, Page } from "@/types";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAppStore } from "@/lib/store";

const Sidebar = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedPageId = useAppStore((s) => s.selectedPageId);
  const setWorkspaceId = useAppStore((s) => s.setWorkspaceId);
  const setPageId = useAppStore((s) => s.setPageId);
  const router = useRouter();
  const path = usePathname();

  // Helper to navigate to tracking page
  const goToTrackingPage = useCallback((workspaceId: string, pageId: string) => {
    if (workspaceId && pageId) {
      router.push(`/workspace/${workspaceId}/page/${pageId}`);
    }
  }, [router]);

  // Fetch workspaces
  useEffect(() => {
    API.getWorkspaces().then(setWorkspaces);
  }, []);

  // Fetch pages for selected workspace
  useEffect(() => {
    if (selectedWorkspaceId) {
      API.getPages(selectedWorkspaceId).then((pages) => {
        setPages(pages);
        // Auto-select first page if none selected
        if (pages.length && !selectedPageId) setPageId(pages[0]._id!);
      });
    } else {
      setPages([]);
    }
  }, [selectedWorkspaceId]);

const [currPage, setCurrPage] = useState<string>("ws");

useEffect(() => {
  if (path.includes('/workspace')) setCurrPage("tp");
  else setCurrPage("ws");
}, [path]);

  function handleClick(id: string) {
   setWorkspaceId(id);
   router.push(`/workspace/${id}`)
  }

  return (
    <aside className="w-64 h-full bg-muted p-4 border-r flex flex-col">
      {currPage==="ws"?<>
      <div className="mb-4 font-bold text-lg">Workspaces</div>
      <ul className="mb-6">
        {workspaces.map((ws) => (
          <li key={ws._id}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${selectedWorkspaceId === ws._id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              onClick={() => {
                handleClick(ws._id!)
                // setWorkspaceId(ws._id!);
                // // If there are pages, navigate to first page
                // API.getPages(ws._id!).then((pages) => {
                //   if (pages.length) {
                //     setPageId(pages[0]._id!);
                //     goToTrackingPage(ws._id!, pages[0]._id!);
                //   }
                // });
              }}
            >
              {ws.name}
            </button>
          </li>
        ))}
      </ul>
      </>
     :  <>
     <div className="mb-2 font-bold text-md">Pages</div>
      <button
        className="btn btn-primary my-2"
        disabled={!selectedWorkspaceId}
        onClick={async () => {
          if (!selectedWorkspaceId) return;
          const name = prompt("Enter page name:");
          if (!name) return;
          const page = await API.createPage(selectedWorkspaceId, name);
          setPageId(page._id!);
          goToTrackingPage(selectedWorkspaceId, page._id!);
        }}
      >
        + New Page
      </button>
      <ul>
        {pages.map((pg) => (
          <li key={pg._id}>
            <button
              className={`w-full text-left px-2 py-1 rounded ${selectedPageId === pg._id ? "bg-secondary text-secondary-foreground" : "hover:bg-accent"}`}
              onClick={() => {
                setPageId(pg._id!);
                if (selectedWorkspaceId) {
                  goToTrackingPage(selectedWorkspaceId, pg._id!);
                }
              }}
            >
              {pg.name}
            </button>
          </li>
        ))}
      </ul>
     </> }
    </aside>
  );
};

export default Sidebar;
