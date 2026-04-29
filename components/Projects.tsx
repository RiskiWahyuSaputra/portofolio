"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "StockFlow Commerce",
    description:
      "A full-featured E-Commerce platform with product catalog, shopping cart, Midtrans payment integration, admin dashboard, and real-time inventory tracking.",
    tech: ["Laravel", "MySQL", "Tailwind"],
    features: [
      "Product catalog",
      "Cart system",
      "Midtrans payment",
      "Admin dashboard",
      "Inventory tracking",
    ],
  },
  {
    number: "02",
    title: "School Management System",
    description:
      "Comprehensive school management solution handling student enrollment, attendance tracking, academic records, and a dedicated parent portal.",
    tech: ["CodeIgniter", "PHP", "MySQL", "Bootstrap"],
    features: [
      "Student system",
      "Attendance",
      "Academic records",
      "Parent portal",
    ],
  },
  {
    number: "03",
    title: "Inventory Management App",
    description:
      "Modern inventory management with barcode scanning, multi-warehouse support, automated stock alerts, and a REST API for integrations.",
    tech: ["Laravel", "JWT", "MySQL"],
    features: [
      "Barcode scanning",
      "Multi warehouse",
      "Stock alerts",
      "REST API",
    ],
  },
  {
    number: "04",
    title: "Practicum Payment Application",
    description:
      "Development of a substitute practicum payment application using QRIS for the Information Technology Department of Lampung State Polytechnic.",
    tech: ["CodeIgniter", "PHP", "MySQL", "Bootstrap"],
    features: [
      "QRIS payment flow",
      "Practicum billing",
      "Payment verification",
      "Admin management",
    ],
  },
  {
    number: "05",
    title: "Customer Support Chat System",
    description:
      "Implementation of a customer support chat system with queue management, AI chatbot automation, real-time live chat, analytics dashboard, and WhatsApp integration.",
    tech: [
      "Laravel 12",
      "PHP 8.2",
      "Blade",
      "Tailwind CSS 4",
      "JavaScript",
      "Alpine.js",
      "Chart.js",
      "Laravel Reverb",
      "Laravel Echo",
      "Pusher JS",
      "MySQL",
      "Gemini API",
      "Groq API",
      "OpenClaw",
      "Webhook API",
    ],
    features: [
      "Queue management",
      "AI chatbot",
      "WhatsApp integration",
      "Realtime live chat",
      "Analytics dashboard",
    ],
  },
];

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      id="projects"
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-20"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            05 / Projects
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            Featured Work
          </h2>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-24">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              <div className="lg:col-span-1">
                <span className="text-sm font-mono text-white/30">
                  {project.number}
                </span>
              </div>

              <div className="lg:col-span-7">
                <h3 className="text-2xl md:text-4xl font-semibold text-white group-hover:text-white/80 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-4 text-base md:text-lg text-white/50 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="p-6 rounded-2xl bg-[#111] border border-white/5 group-hover:border-white/10 transition-colors">
                  <h4 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-4">
                    Key Features
                  </h4>
                  <ul className="space-y-3">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-white/60"
                      >
                        <ArrowUpRight
                          size={14}
                          className="text-white/30 flex-shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
