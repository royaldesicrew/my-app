"use client";

import { useState, useEffect } from "react";
import { Search, CalendarDays, Trash2, Mail, Phone, CalendarCheck2, ExternalLink, ChevronDown, CheckCircle2 } from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking request?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "contacted": return "bg-blue-100 text-blue-700 border-blue-200";
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = b.name?.toLowerCase().includes(search.toLowerCase()) || 
                          b.email?.toLowerCase().includes(search.toLowerCase()) ||
                          b.phone?.includes(search);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-premium font-extrabold text-gray-900 tracking-tight">Booking Requests</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and track your client event inquiries.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input 
            placeholder="Search by name, email, or phone..." 
            className="flex-1 border-none focus:ring-0 text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center p-2 bg-white rounded-3xl shadow-sm border border-gray-100">
          {["all", "pending", "contacted", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${
                statusFilter === status 
                  ? "bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/20" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-[32px] animate-pulse" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 transition-all hover:shadow-md hover:border-[#FF6B4A]/30"
            >
              {/* Left Column - Client Info */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                    <span className="font-premium font-bold text-lg text-gray-700">
                      {booking.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{booking.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(booking.createdAt))}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  {booking.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <Mail size={16} className="text-[#FF6B4A]" />
                      <a href={`mailto:${booking.email}`} className="hover:text-[#FF6B4A] transition-colors">{booking.email}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                    <Phone size={16} className="text-[#FF6B4A]" />
                    <a href={`tel:${booking.phone}`} className="hover:text-[#FF6B4A] transition-colors">{booking.phone}</a>
                  </div>
                </div>
              </div>

              {/* Middle Column - Event Details */}
              <div className="flex-[2] bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarCheck2 className="h-4 w-4 text-[#FF6B4A]" />
                  <span className="text-[10px] font-bold tracking-widest text-[#FF6B4A] uppercase">Event Details</span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {booking.service && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Type</p>
                      <p className="text-sm font-bold text-gray-900">{booking.service}</p>
                    </div>
                  )}
                  {booking.package && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Package</p>
                      <p className="text-sm font-bold text-gray-900">{booking.package}</p>
                    </div>
                  )}
                  {booking.venue && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Venue</p>
                      <p className="text-sm font-bold text-gray-900">{booking.venue}</p>
                    </div>
                  )}
                  {booking.caterer && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Caterer</p>
                      <p className="text-sm font-bold text-gray-900">{booking.caterer}</p>
                    </div>
                  )}
                  {booking.artist && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Artist / Entertainment</p>
                      <p className="text-sm font-bold text-gray-900">{booking.artist}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="flex-1 flex flex-col items-end justify-between min-w-[200px]">
                <div className="w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                  <div className="relative">
                    <select
                      value={booking.status || 'pending'}
                      onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                      className={`w-full appearance-none px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 transition-all ${getStatusColor(booking.status || 'pending')}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <a 
                    href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all border border-transparent hover:border-green-100"
                    title="WhatsApp"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => handleDelete(booking._id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    title="Delete Request"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No bookings found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">There are currently no booking requests matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
