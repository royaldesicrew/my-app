import "./admin.css";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-aside">
        <Sidebar />
      </aside>
      <main className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
