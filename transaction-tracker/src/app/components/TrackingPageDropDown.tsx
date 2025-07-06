// WorkspaceDropdown.tsx
// Dropdown for workspace actions (create/list)
"use client"
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Page } from "@/types";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const TrackingPageDropDown = () => {
  const [TP, setTP] = useState<Page[]>([]);
  const [name, setName] = useState("");
  const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const setPageId = useAppStore((s) => s.setPageId);
  // const setPageId = useAppStore((s) => s.setPageId);
  const router = useRouter();

  // Helper to navigate to tracking page
  const goToPage = useCallback((PageId: string) => {
    if (PageId ) {
      router.push(`/workspace/${selectedWorkspaceId}/page/${PageId}`);
    }
  }, [router]);

  useEffect(() => {
    API.getPages(selectedWorkspaceId!).then(setTP);
  }, [setTP]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const page = await API.createPage(selectedWorkspaceId!,name.trim());
    setTP([...TP, page]);
    setPageId(page._id!);
    // Immediately create a default page
    goToPage(page._id!);
    setName("");
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-2">
      </div>
      <div className="flex gap-2">
        <input
          className="input input-bordered"
          placeholder="New Page name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreate} type="button">Create</button>
      </div>
    </div>
  );
};

export default TrackingPageDropDown;
