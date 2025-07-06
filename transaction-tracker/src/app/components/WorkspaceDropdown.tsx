// WorkspaceDropdown.tsx
// Dropdown for workspace actions (create/list)

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Workspace } from "@/types";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const WorkspaceDropdown = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [name, setName] = useState("");
  // const selectedWorkspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const setWorkspaceId = useAppStore((s) => s.setWorkspaceId);
  // const setPageId = useAppStore((s) => s.setPageId);
  const router = useRouter();

  // Helper to navigate to tracking page
  const goToWS = useCallback((workspaceId: string) => {
    if (workspaceId ) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [router]);

  useEffect(() => {
    API.getWorkspaces().then(setWorkspaces);
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const ws = await API.createWorkspace(name.trim());
    setWorkspaces([...workspaces, ws]);
    setWorkspaceId(ws._id!);
    // Immediately create a default page
    goToWS(ws._id!);
    setName("");
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-2">
      </div>
      <div className="flex gap-2">
        <input
          className="input input-bordered"
          placeholder="New workspace name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreate} type="button">Create</button>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
