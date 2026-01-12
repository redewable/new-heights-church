"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Users, Heart, Coffee, Baby, Car, HelpCircle } from "lucide-react";

const serviceTimes = [
  {
    day: "Sundays",
    time: "10:00 AM",
    description: "Main Worship Service"
  },
  {
    day: "Wednesdays",
    time: "7:00 PM",
    description: "Midweek Service"
  }
];

const expectations = [
  {
    icon: Clock,
    title: "Service Length",
    description: "Our services typically last about 75-90 minutes with engaging worship and a relevant message."
  },
  {
    icon: Users,
    title: "What to Wear",
    description: "Come as you are! You'll see everything from jeans to suits. We want you to feel comfortable."
  },
  {
    icon: Coffee,
    title: "Refreshments",
    description: "Grab a cup of coffee and connect with others before or after the service."
  },
  {
    icon: Baby,
    title: "Kids Ministry",
    description: "Safe, fun, and engaging environments for kids from birth through 5th grade during all services."
  },
  {
    icon: Car,
    title: "Parking",
    description: "We have plenty of free parking. Look for our parking team who will help direct you."
  },
  {
    icon: Heart,
    title: "First Time?",
    description: "Stop by our Welcome Center and let us know it's your first time. We have a gift for you!"
  }
];

export default function VisitPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-bg">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container-site text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              We Can't Wait to Meet You
            </p>
            <h1 className="font-heading text-display-lg text-text-primary mb-6 max-w-3xl mx-auto">
              Plan Your <span className="text-gradient-gold">Visit</span>
            </h1>
            <p className="text-text-secondary text-body-lg max-w-2xl mx-auto">
              Whether you're new to church or just new to New Heights, we'd love to help you feel at home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Times */}
      <section className="section bg-bg-secondary">
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Join Us
            </p>
            <h2 className="font-heading text-display-sm text-text-primary">
              Service Times
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {serviceTimes.map((service, index) => (
              <motion.div
                key={service.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center group hover:shadow-gold-glow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Clock className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-heading text-display-sm text-text-primary mb-2">
                  {service.day}
                </h3>
                <p className="text-gold text-display-md font-heading mb-2">
                  {service.time}
                </p>
                <p className="text-text-secondary">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section bg-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
                Find Us
              </p>
              <h2 className="font-heading text-display-sm text-text-primary mb-6">
                Our Location
              </h2>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-heading-md text-text-primary mb-1">
                    New Heights Church
                  </h3>
                  <p className="text-text-secondary">
                    8125 Turkey Creek Rd.<br />
                    College Station, TX 77845
                  </p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=8125+Turkey+Creek+Rd+College+Station+TX+77845"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3432.8!2d-96.3!3d30.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s8125+Turkey+Creek+Rd%2C+College+Station%2C+TX+77845!5e0!3m2!1sen!2sus!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="New Heights Church Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section bg-bg-secondary">
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">
              Be Prepared
            </p>
            <h2 className="font-heading text-display-sm text-text-primary mb-4">
              What to Expect
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We know visiting a new church can feel overwhelming. Here's what you can expect when you arrive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expectations.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-heading-md text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-bg">
        <div className="container-site">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-gold" />
              </div>
              <h2 className="font-heading text-display-sm text-text-primary mb-4">
                Common Questions
              </h2>
            </div>

            <div className="space-y-4">
              <div className="card">
                <h3 className="font-heading text-heading-md text-text-primary mb-2">
                  Do I need to register before visiting?
                </h3>
                <p className="text-text-secondary">
                  No registration required! Just show up and we'll take care of the rest. However, if you'd like, you can let us know you're coming and we'll have someone ready to greet you.
                </p>
              </div>

              <div className="card">
                <h3 className="font-heading text-heading-md text-text-primary mb-2">
                  What about my kids?
                </h3>
                <p className="text-text-secondary">
                  We have age-appropriate environments for kids from birth through 5th grade. Our team members are background checked and trained to provide a safe, fun experience for your children.
                </p>
              </div>

              <div className="card">
                <h3 className="font-heading text-heading-md text-text-primary mb-2">
                  Will I be called out as a visitor?
                </h3>
                <p className="text-text-secondary">
                  Absolutely not! We won't embarrass you or single you out. We want you to be able to experience the service at your own pace.
                </p>
              </div>

              <div className="card">
                <h3 className="font-heading text-heading-md text-text-primary mb-2">
                  Is there a dress code?
                </h3>
                <p className="text-text-secondary">
                  Come as you are! We're more concerned about you being comfortable than what you're wearing. You'll see everything from jeans to dress clothes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-bg-secondary to-bg">
        <div className="container-site text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-display-sm text-text-primary mb-4">
              We'll See You Soon!
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-8">
              Still have questions? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:979-314-7585" className="btn-primary">
                Call Us: 979-314-7585
              </a>
              <Link href="/about" className="btn-secondary">
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
