"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Calendar, Heart } from "lucide-react";

export function HeroDefault() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-bg">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-bg/80 to-bg" />
        
        {/* Optional: Background image or video */}
        {/* <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video> */}
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative container-site text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gold uppercase tracking-[0.3em] text-sm mb-6"
          >
            Welcome to New Heights
          </motion.p>

          {/* Main Headline */}
          <h1 className="font-heading text-display-lg md:text-display-xl text-text-primary mb-6 max-w-4xl mx-auto">
            We Exist to{" "}
            <span className="text-gradient-gold">Love People</span>
            <br />
            and Point Them to{" "}
            <span className="text-gradient-gold">Christ</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-secondary text-body-lg max-w-2xl mx-auto mb-10"
          >
            Join us this Sunday for an experience that will transform your life.
            Everyone is welcome at New Heights.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/watch" className="btn-primary text-base px-8 py-4">
              <Play className="w-5 h-5" />
              Watch Latest
            </Link>
            <Link href="/visit" className="btn-secondary text-base px-8 py-4">
              <Calendar className="w-5 h-5" />
              Plan a Visit
            </Link>
          </motion.div>

          {/* Service Times */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10"
          >
            <Heart className="w-4 h-4 text-gold" />
            <span className="text-text-secondary text-sm">
              Join us Sundays at <span className="text-text-primary font-medium">9:00 AM</span> & <span className="text-text-primary font-medium">11:00 AM</span>
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
