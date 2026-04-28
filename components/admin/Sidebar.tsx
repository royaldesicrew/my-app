"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  MapPin, 
  Utensils, 
  FolderSearch,
  Ticket,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users,
  FileText,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Bookings",
    icon: CalendarDays,
    href: "/admin/bookings",
  },
  {
    label: "Gallery",
    icon: ImageIcon,
    href: "/admin/gallery",
  },
  {
    label: "Venues",
    icon: MapPin,
    href: "/admin/venues",
  },
  {
    label: "Caterers",
    icon: Utensils,
    href: "/admin/caterers",
  },
  {
    label: "Packages",
    icon: Ticket,
    href: "/admin/packages",
  },
  {
    label: "Media Library",
    icon: FolderSearch,
    href: "/admin/media",
  },
  {
    label: "Blogs",
    icon: BookOpen,
    href: "/admin/blogs",
  },
  {
    label: "Artists",
    icon: Users,
    href: "/admin/artists",
  },
  {
    label: "Catalogs",
    icon: FileText,
    href: "/admin/catalogs",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar flex flex-col h-full">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <Sparkles className="h-4 w-4 text-[#FF6B4A]" />
        <div>
          <span className="admin-logo-text">ROYAL DESI</span>
          <span className="admin-logo-sub">CMS Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        <p className="admin-nav-section-label">Navigation</p>
        <div className="admin-nav-links">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn("admin-nav-link", isActive && "admin-nav-link-active")}
              >
                <div className={cn("admin-nav-icon", isActive && "admin-nav-icon-active")}>
                  <route.icon className="h-4 w-4" />
                </div>
                <span className="flex-1">{route.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <div className="admin-footer-badge">
          <div className="admin-footer-dot" />
          <span>Live — All systems operational</span>
        </div>
        <Link href="/" className="admin-view-site-btn">
          View Live Site →
        </Link>
      </div>
    </div>
  );
};
