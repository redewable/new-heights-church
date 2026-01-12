"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bell,
  Search,
  ChevronDown,
  Phone,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Mock data for demo
const mockRooms = [
  { id: "1", name: "Nursery", capacity: 10, minAge: 0, maxAge: 12 },
  { id: "2", name: "Toddlers", capacity: 12, minAge: 12, maxAge: 24 },
  { id: "3", name: "Pre-K", capacity: 15, minAge: 24, maxAge: 60 },
  { id: "4", name: "Elementary", capacity: 20, minAge: 60, maxAge: 144 },
];

const mockCheckins = [
  {
    id: "1",
    childName: "Emma Johnson",
    age: "3 years",
    room: "Pre-K",
    roomId: "3",
    parentName: "Sarah Johnson",
    parentPhone: "(555) 123-4567",
    pickupCode: "4827",
    checkedInAt: "9:05 AM",
    allergies: "Peanut allergy",
    notes: null,
    status: "checked_in",
    photoUrl: null,
  },
  {
    id: "2",
    childName: "Liam Smith",
    age: "4 years",
    room: "Pre-K",
    roomId: "3",
    parentName: "Mike Smith",
    parentPhone: "(555) 234-5678",
    pickupCode: "3291",
    checkedInAt: "9:12 AM",
    allergies: null,
    notes: "First time visitor",
    status: "checked_in",
    photoUrl: null,
  },
  {
    id: "3",
    childName: "Olivia Brown",
    age: "2 years",
    room: "Toddlers",
    roomId: "2",
    parentName: "Jessica Brown",
    parentPhone: "(555) 345-6789",
    pickupCode: "7156",
    checkedInAt: "9:08 AM",
    allergies: "Dairy intolerance",
    notes: null,
    status: "checked_in",
    photoUrl: null,
  },
  {
    id: "4",
    childName: "Noah Davis",
    age: "6 years",
    room: "Elementary",
    roomId: "4",
    parentName: "Chris Davis",
    parentPhone: "(555) 456-7890",
    pickupCode: "8423",
    checkedInAt: "8:55 AM",
    allergies: null,
    notes: null,
    status: "checked_in",
    photoUrl: null,
  },
];

interface CheckinCardProps {
  checkin: typeof mockCheckins[0];
  onAlertParent: (id: string) => void;
  onCheckout: (id: string) => void;
}

function CheckinCard({ checkin, onAlertParent, onCheckout }: CheckinCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
          {checkin.photoUrl ? (
            <img
              src={checkin.photoUrl}
              alt={checkin.childName}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <User className="w-6 h-6 text-gold" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading text-heading-sm text-text-primary">
                {checkin.childName}
              </h3>
              <p className="text-text-secondary text-sm">
                {checkin.age} • Code: <span className="font-mono font-bold text-gold">{checkin.pickupCode}</span>
              </p>
            </div>
            <span className="text-xs text-text-muted">
              {checkin.checkedInAt}
            </span>
          </div>

          {/* Alerts */}
          {(checkin.allergies || checkin.notes) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {checkin.allergies && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-error/20 text-error-light text-xs rounded">
                  <AlertTriangle className="w-3 h-3" />
                  {checkin.allergies}
                </span>
              )}
              {checkin.notes && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/20 text-warning-light text-xs rounded">
                  {checkin.notes}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onAlertParent(checkin.id)}
              className="btn-ghost text-xs py-1.5 px-3 text-warning-light hover:bg-warning/20"
            >
              <Bell className="w-3 h-3" />
              Alert Parent
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="btn-ghost text-xs py-1.5 px-3"
            >
              Details
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                showDetails && "rotate-180"
              )} />
            </button>
            <button
              onClick={() => onCheckout(checkin.id)}
              className="btn-ghost text-xs py-1.5 px-3 text-success-light hover:bg-success/20 ml-auto"
            >
              <LogOut className="w-3 h-3" />
              Checkout
            </button>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-text-muted" />
                    <span className="text-text-secondary">
                      Parent: {checkin.parentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-text-muted" />
                    <a
                      href={`tel:${checkin.parentPhone}`}
                      className="text-gold hover:underline"
                    >
                      {checkin.parentPhone}
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function OpsRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkins, setCheckins] = useState(mockCheckins);

  // Filter checkins by room and search
  const filteredCheckins = checkins.filter((c) => {
    const matchesRoom = !selectedRoom || c.roomId === selectedRoom;
    const matchesSearch =
      !searchQuery ||
      c.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pickupCode.includes(searchQuery);
    return matchesRoom && matchesSearch && c.status === "checked_in";
  });

  // Get counts per room
  const roomCounts = mockRooms.map((room) => ({
    ...room,
    count: checkins.filter(
      (c) => c.roomId === room.id && c.status === "checked_in"
    ).length,
  }));

  const handleAlertParent = (checkinId: string) => {
    // In production: Send push notification via API
    console.log("Alert parent for checkin:", checkinId);
    alert("Parent notification sent!");
  };

  const handleCheckout = (checkinId: string) => {
    // In production: Update database, require pickup code verification
    const code = prompt("Enter pickup code:");
    const checkin = checkins.find((c) => c.id === checkinId);
    
    if (code === checkin?.pickupCode) {
      setCheckins((prev) =>
        prev.map((c) =>
          c.id === checkinId ? { ...c, status: "checked_out" } : c
        )
      );
      alert("Child checked out successfully!");
    } else {
      alert("Invalid pickup code!");
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-premium border-b border-white/5">
        <div className="container-site py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-heading-lg text-text-primary">
                Kids Check-in
              </h1>
              <p className="text-text-secondary text-sm">
                Room Dashboard • Sunday 9:00 AM Service
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-text-primary font-medium">
                  {filteredCheckins.length} Children
                </p>
                <p className="text-text-muted text-xs">Currently checked in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Room Selection */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h2 className="text-xs uppercase tracking-wider text-text-muted mb-3">
                Rooms
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-colors",
                    !selectedRoom
                      ? "bg-gold/20 border border-gold/30"
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-text-primary font-medium">
                      All Rooms
                    </span>
                    <span className="text-gold font-bold">
                      {checkins.filter((c) => c.status === "checked_in").length}
                    </span>
                  </div>
                </button>

                {roomCounts.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      selectedRoom === room.id
                        ? "bg-gold/20 border border-gold/30"
                        : "bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-text-primary font-medium">
                        {room.name}
                      </span>
                      <span
                        className={cn(
                          "font-bold",
                          room.count >= room.capacity
                            ? "text-error"
                            : room.count >= room.capacity * 0.8
                            ? "text-warning"
                            : "text-gold"
                        )}
                      >
                        {room.count}/{room.capacity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Checkin Cards */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by name or pickup code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-11"
              />
            </div>

            {/* Checkin Cards */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredCheckins.length > 0 ? (
                  filteredCheckins.map((checkin) => (
                    <CheckinCard
                      key={checkin.id}
                      checkin={checkin}
                      onAlertParent={handleAlertParent}
                      onCheckout={handleCheckout}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <h3 className="font-heading text-heading-md text-text-primary mb-2">
                      No Children Checked In
                    </h3>
                    <p className="text-text-secondary">
                      {selectedRoom
                        ? "No children in this room yet."
                        : "No children checked in to any room."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
