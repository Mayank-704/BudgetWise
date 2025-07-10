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


import { FiChevronLeft, FiChevronRight, FiPlus, FiFolder, FiFileText } from "react-icons/fi";

const Sidebar = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const selectedPageId = useAppStore((s) => s.selectedPageId);
  const setWorkspaceId = useAppStore((s) => s.setWorkspaceId);
  const setPageId = useAppStore((s) => s.setPageId);
  const router = useRouter();
  const path = usePathname();

  // Collapsible sidebar state
  const [collapsed, setCollapsed] = useState(false);
  // New page input state
  const [showNewPageInput, setShowNewPageInput] = useState(false);
  const [newPageName, setNewPageName] = useState("");

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

  async function handleAddPage() {
    if (!selectedWorkspaceId || !newPageName.trim()) return;
    const page = await API.createPage(selectedWorkspaceId, newPageName.trim());
    setPageId(page._id!);
    goToTrackingPage(selectedWorkspaceId, page._id!);
    setShowNewPageInput(false);
    setNewPageName("");
  }
  return (
    <aside className={`h-full bg-muted border-r flex flex-col transition-all duration-300 ${collapsed ? 'w-16 p-2' : 'w-64 p-4'}`}>
      {/* Collapse/Expand Button */}
      <button
        className="self-end mb-2 text-xl p-1 rounded hover:bg-accent transition"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>

      {/* Navigation Links */}
      {!collapsed && (
        <nav className="mb-6 flex gap-2">
          <button
            className={`flex-1 py-2 rounded font-semibold transition flex items-center justify-center gap-2 ${currPage === "ws" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            onClick={() => {
              setCurrPage("ws");
              router.push("/");
            }}
          >
            <FiFolder /> <span>Workspaces</span>
          </button>
          <button
            className={`flex-1 py-2 rounded font-semibold transition flex items-center justify-center gap-2 ${currPage === "tp" ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
            onClick={() => {
              if (selectedWorkspaceId && pages.length) {
                setCurrPage("tp");
                goToTrackingPage(selectedWorkspaceId, selectedPageId || pages[0]._id!);
              }
            }}
            disabled={!selectedWorkspaceId || !pages.length}
          >
            <FiFileText /> <span>Pages</span>
          </button>
        </nav>
      )}

      {/* Workspaces List */}
      {currPage === "ws" && !collapsed && (
        <>
          <div className="mb-4 font-bold text-lg flex items-center gap-2">
            <FiFolder /> Workspaces
            <button
              className="ml-auto btn btn-xs btn-primary flex items-center gap-1"
              title="Add Workspace (not implemented)"
              disabled
            >
              <FiPlus />
            </button>
          </div>
          <ul className="mb-6">
            {workspaces.map((ws) => (
              <li key={ws._id}>
                <button
                  className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 ${selectedWorkspaceId === ws._id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                  onClick={() => {
                    handleClick(ws._id!);
                  }}
                >
                  <FiFolder className="opacity-60" /> {ws.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Pages List */}
      {currPage === "tp" && !collapsed && (
        <>
          <div className="mb-2 font-bold text-md flex items-center gap-2">
            <FiFileText /> Pages
            <button
              className="ml-auto btn btn-xs btn-primary flex items-center gap-1"
              disabled={!selectedWorkspaceId}
              onClick={() => setShowNewPageInput(true)}
              title="Add New Page"
            >
              <FiPlus />
            </button>
          </div>
          {/* New Page Input */}
          {showNewPageInput && (
            <div className="flex items-center gap-2 mb-2">
              <input
                className="input input-sm flex-1"
                type="text"
                placeholder="Page name"
                value={newPageName}
                onChange={e => setNewPageName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddPage();
                  if (e.key === 'Escape') { setShowNewPageInput(false); setNewPageName(""); }
                }}
                autoFocus
              />
              <button className="btn btn-xs btn-success" onClick={handleAddPage} title="Create Page"><FiPlus /></button>
              <button className="btn btn-xs btn-error" onClick={() => { setShowNewPageInput(false); setNewPageName(""); }} title="Cancel">✕</button>
            </div>
          )}
          <ul>
            {pages.map((pg) => (
              <li key={pg._id}>
                <button
                  className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 ${selectedPageId === pg._id ? "bg-secondary text-secondary-foreground" : "hover:bg-accent"}`}
                  onClick={() => {
                    setPageId(pg._id!);
                    if (selectedWorkspaceId) {
                      goToTrackingPage(selectedWorkspaceId, pg._id!);
                    }
                  }}
                >
                  <FiFileText className="opacity-60" /> {pg.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}


    </aside>
  );
}

export default Sidebar;
