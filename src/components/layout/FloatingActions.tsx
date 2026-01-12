"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Plus, 
  X, 
  MapPin, 
  Heart, 
  Baby, 
  MessageCircle 
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const actions = [
  {
    name: "Plan a Visit",
    href: "/visit",
    icon: MapPin,
    color: "bg-gold",
  },
  {
    name: "Give",
    href: "/give",
    icon: Heart,
    color: "bg-success",
  },
  {
    name: "Kids Check-in",
    href: "/member/family",
    icon: Baby,
    color: "bg-warning",
  },
  {
    name: "Prayer Request",
    href: "#prayer",
    icon: MessageCircle,
    color: "bg-gold",
  },
];

export function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 mb-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <span className="px-3 py-2 bg-bg-elevated rounded-lg text-sm text-text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-elevated">
                    {action.name}
                  </span>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                      action.color
                    )}
                  >
                    <action.icon className="w-5 h-5 text-bg" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
          isOpen
            ? "bg-bg-elevated border border-white/10 rotate-45"
            : "bg-gold shadow-gold-glow"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-text-primary" />
        ) : (
          <Plus className="w-6 h-6 text-bg" />
        )}
      </motion.button>
    </div>
  );
}
