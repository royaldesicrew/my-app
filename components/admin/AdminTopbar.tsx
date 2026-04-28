"use client";

import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/gallery": "Gallery",
  "/admin/venues": "Venues",
  "/admin/caterers": "Caterers",
  "/admin/media": "Media Library",
};

export const AdminTopbar = () => {
  const pathname = usePathname();
  const current = labels[pathname] || "Admin";

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-inner">
        <div className="admin-breadcrumb">
          <span className="admin-breadcrumb-root">Admin</span>
          <span className="admin-breadcrumb-sep">/</span>
          <span className="admin-breadcrumb-current">{current}</span>
        </div>
        <div className="admin-topbar-actions">
          <div className="admin-status-pill">
            <span className="admin-status-dot" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
