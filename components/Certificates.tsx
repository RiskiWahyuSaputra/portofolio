"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Award } from "lucide-react";
import { useLang } from "./LangContext";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
};

const certificates: Certificate[] = [
  {
    id: "01",
    title: "Programming Fundamental - Nasional (Digital Talent Academy)",
    issuer: "Digital Talent Scholarship",
    date: "2026",
    image: "/certificates/cert-01.png",
    credentialUrl: "#",
  },
  {
    id: "02",
    title: "Front-End & Back-End Development (Digital Talent Academy)",
    issuer: "Digital Talent Scholarship",
    date: "2026",
    image: "/certificates/cert-02.png",
    credentialUrl: "#",
  },
  {
    id: "03",
    title: "Full Stack Developer (Digital Talent Academy)",
    issuer: "Digital Talent Scholarship",
    date: "2026",
    image: "/certificates/cert-03.png",
    credentialUrl: "#",
  },
  {
    id: "04",
    title: "Belajar Membuat Front-End Web untuk Pemula",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-04.png",
    credentialUrl: "https://www.dicoding.com/certificates/6RPN7Y388X2M",
  },
  {
    id: "05",
    title: "Belajar Membuat Aplikasi Web dengan React",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-05.png",
    credentialUrl: "https://www.dicoding.com/certificates/L4PQ95R22PO1",
  },
  {
    id: "06",
    title: "Belajar Dasar AI",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-06.png",
    credentialUrl: "https://www.dicoding.com/certificates/81P25VEVYPOY",
  },
  {
    id: "07",
    title: "Belajar Penggunaan Generative AI",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-07.png",
    credentialUrl: "https://www.dicoding.com/certificates/N9ZONNVO0XG5",
  },
  {
    id: "08",
    title: "Spec-Driven Development dengan Kiro",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-08.png",
    credentialUrl: "https://www.dicoding.com/certificates/RVZK002L4ZD5",
  },
  {
    id: "09",
    title: "Belajar Dasar Cloud dan Gen AI di AWS",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-09.png",
    credentialUrl: "https://www.dicoding.com/certificates/81P2OOY0JZOY",
  },
  {
    id: "10",
    title: "Memulai Pemrograman dengan Python",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-10.png",
    credentialUrl: "https://www.dicoding.com/certificates/2VX30VW2VXYQ",
  },
  {
    id: "11",
    title: "Belajar Machine Learning untuk Pemula",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-11.png",
    credentialUrl: "",
  },
  {
    id: "12",
    title: "Ai Praktis Untuk Produktivitas",
    issuer: "Dicoding Indonesia",
    date: "2026",
    image: "/certificates/cert-12.png",
    credentialUrl: "https://www.dicoding.com/certificates/4EXG11DN9PRL",
  },
];

const PER_PAGE = 6;

function CertModal({
  cert,
  onClose,
  verifyLabel,
}: {
  cert: Certificate;
  onClose: () => void;
  verifyLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 pb-8 px-4 md:px-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        className="relative w-full max-w-2xl rounded-2xl bg-[#111] border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="relative w-full aspect-[800/560] overflow-hidden">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>

        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{cert.title}</h3>
            <p className="mt-1 text-sm text-white/40">
              {cert.issuer} · {cert.date}
            </p>
          </div>
          {cert.credentialUrl && cert.credentialUrl !== "#" && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all"
            >
              {verifyLabel}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Certificates() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [page, setPage] = useState(0);
  const { lang } = useLang();

  const lx = {
    EN: {
      section: "07 / Certificates",
      heading: "Certifications",
      viewCert: "View Certificate",
      verify: "Verify",
    },
    ID: {
      section: "07 / Sertifikat",
      heading: "Sertifikasi",
      viewCert: "Lihat Sertifikat",
      verify: "Verifikasi",
    },
  }[lang];

  const totalPages = Math.ceil(certificates.length / PER_PAGE);
  const paginated = certificates.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE,
  );

  return (
    <section
      ref={ref}
      id="certificates"
      className="relative py-24 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-10 md:mb-20"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {lx.section}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            {lx.heading}
          </h2>
        </motion.div>

        {/* Mobile horizontal gallery */}
        <div
          data-lenis-prevent
          className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {certificates.map((cert, index) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group w-[82vw] max-w-[340px] flex-none snap-center cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#111] transition-all duration-300"
              onClick={() => setSelected(cert)}
            >
              <div className="relative w-full aspect-[800/560] overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover"
                  sizes="82vw"
                />
              </div>

              <div className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-white/30">
                    {cert.id}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/45">
                    {cert.date}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-white">
                  {cert.title}
                </h3>
                <p className="mt-1 truncate text-xs text-white/40">
                  {cert.issuer}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((cert, index) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#111] border border-white/5 hover:border-white/15 transition-all duration-300"
              onClick={() => setSelected(cert)}
            >
              {/* Image */}
              <div className="relative w-full aspect-[800/560] overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-mono text-white/80 uppercase tracking-widest border border-white/30 rounded-full px-4 py-2">
                    {lx.viewCert}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10">
                  <Award size={14} className="text-white/40" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white group-hover:text-white/80 transition-colors truncate">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    {cert.issuer} · {cert.date}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 hidden sm:flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-mono transition-all ${
                  page === i
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 hover:border-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              →
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <CertModal
            cert={selected}
            onClose={() => setSelected(null)}
            verifyLabel={lx.verify}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
