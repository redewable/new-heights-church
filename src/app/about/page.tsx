"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, BookOpen, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              About Us
            </p>
            <h1 className="font-heading text-display-lg text-text-primary mb-6">
              We Exist to <span className="text-gradient-gold">Love People</span> and Point Them to <span className="text-gradient-gold">Christ</span>
            </h1>
            <p className="text-text-secondary text-body-lg">
              God puts a premium on people. So do we. You and your family are important to us and we look forward to serving you soon!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="section bg-bg-secondary">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                Our Purpose
              </p>
              <h2 className="font-heading text-display-sm text-text-primary mb-6">
                You Matter to God.<br />You Matter to Us.
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p>
                  New Heights has a clear vision: To Love People and Point Them to Christ. Join us and help reach the community of Bryan/College Station!
                </p>
                <p>
                  Whether you're exploring faith for the first time or looking for a church to call home, you'll find a warm, welcoming community here at New Heights.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/visit" className="btn-primary">
                  Plan Your Visit
                </Link>
                <Link href="/about/beliefs" className="btn-secondary">
                  What We Believe
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-heading-sm text-text-primary mb-2">Love</h3>
                <p className="text-text-secondary text-sm">Loving God and loving people is at the heart of everything we do.</p>
              </div>
              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-heading-sm text-text-primary mb-2">Community</h3>
                <p className="text-text-secondary text-sm">We believe life is better together in authentic community.</p>
              </div>
              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-heading-sm text-text-primary mb-2">Truth</h3>
                <p className="text-text-secondary text-sm">The Bible is our foundation for life and faith.</p>
              </div>
              <div className="card text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-heading-sm text-text-primary mb-2">Growth</h3>
                <p className="text-text-secondary text-sm">We're committed to helping you take your next step with Jesus.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pastor Section */}
      <section className="section bg-bg">
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Our Pastors
            </p>
            <h2 className="font-heading text-display-sm text-text-primary">
              Meet the Hallams
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/team/brian-crystal.jpg"
                  alt="Pastors Brian and Crystal Hallam"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-heading text-display-sm text-text-primary mb-2">
                Brian & Crystal Hallam
              </h3>
              <p className="text-gold text-sm uppercase tracking-wider mb-6">
                Founders & Senior Pastors
              </p>
              <div className="space-y-4 text-text-secondary">
                <p>
                  Brian and Crystal Hallam are the founders and senior pastors of New Heights Church in College Station, TX. Their ministry is making a great impact in the local church and beyond.
                </p>
                <p>
                  They live in the College Station area with their three children: Hailey, Walker, and Trinity.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Family Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
              <Image
                src="/images/team/hallam-family.jpg"
                alt="The Hallam Family"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-text-primary font-heading text-heading-lg">The Hallam Family</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section bg-bg-secondary">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.a
              href="https://maps.google.com/?q=8125+Turkey+Creek+Rd+College+Station+TX+77845"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <MapPin className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-heading-sm text-text-primary mb-2">Location</h3>
              <p className="text-text-secondary text-sm">
                8125 Turkey Creek Rd.<br />
                College Station, TX 77845
              </p>
            </motion.a>

            <motion.a
              href="tel:979-314-7585"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-heading-sm text-text-primary mb-2">Phone</h3>
              <p className="text-text-secondary text-sm">
                979-314-7585
              </p>
            </motion.a>

            <motion.a
              href="mailto:hello@newheightschurch.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-heading text-heading-sm text-text-primary mb-2">Email</h3>
              <p className="text-text-secondary text-sm">
                hello@newheightschurch.com
              </p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bg">
        <div className="container-site text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-display-sm text-text-primary mb-4">
              Ready to Visit?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-8">
              We'd love to meet you! Plan your visit and find out what to expect when you arrive.
            </p>
            <Link href="/visit" className="btn-primary">
              Plan Your Visit
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
