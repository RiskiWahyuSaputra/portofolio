"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useLang } from "./LangContext";
import DriftWall from "./DriftWall";
import "./CertificatesDrift.css";

const certificates = [
  ["/certificates/cert-01.png", "Programming Fundamental", "https://digitalent.kominfo.go.id/cek-sertifikat"],
  ["/certificates/cert-02.png", "Front-End & Back-End Development", "https://digitalent.kominfo.go.id/cek-sertifikat"],
  ["/certificates/cert-03.png", "Full Stack Developer", "https://digitalent.kominfo.go.id/cek-sertifikat"],
  ["/certificates/cert-04.png", "Front-End Web untuk Pemula", "https://www.dicoding.com/certificates/6RPN7Y388X2M"],
  ["/certificates/cert-05.png", "Aplikasi Web dengan React", "https://www.dicoding.com/certificates/L4PQ95R22PO1"],
  ["/certificates/cert-06.png", "Belajar Dasar AI", "https://www.dicoding.com/certificates/81P25VEVYPOY"],
  ["/certificates/cert-07.png", "Generative AI", "https://www.dicoding.com/certificates/N9ZONNVO0XG5"],
  ["/certificates/cert-08.png", "Spec-Driven Development", "https://www.dicoding.com/certificates/RVZK002L4ZD5"],
  ["/certificates/cert-09.png", "Cloud dan Gen AI di AWS", "https://www.dicoding.com/certificates/81P2OOY0JZOY"],
  ["/certificates/cert-10.png", "Pemrograman dengan Python", "https://www.dicoding.com/certificates/2VX30VW2VXYQ"],
  ["/certificates/cert-12.png", "AI Praktis Untuk Produktivitas", "https://www.dicoding.com/certificates/4EXG11DN9PRL"],
  ["/certificates/cert-11.png", "Build An AI Agent", "https://www.credly.com/badges/2f8fdadd-10a8-4c57-9695-5e19bb671af1/linked_in_profile"],
  ["/certificates/cert-13.png", "Applied AI Foundations", "https://academy.openai.com/"],
  ["/certificates/cert-14.png", "Agents and Workflows", "https://academy.openai.com/"],
  ["/certificates/cert-15.png", "#JuaraVibeCoding - Google Developer Groups", "https://goo.gle/jvc-cert-verifier"],
];

export default function CertificatesDrift() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<{ image: string; title: string; credentialUrl: string } | null>(null);
  const items = certificates.map(([image, title, credentialUrl]) => ({ image, title, credentialUrl }));

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <section id="certificates" className="relative overflow-hidden bg-[#050505] px-6 py-24 md:px-12 md:py-36 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 md:mb-12">
          <span className="text-sm font-mono uppercase tracking-widest text-white/40">
            {lang === "ID" ? "07 / Sertifikat" : "07 / Certificates"}
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            {lang === "ID" ? "Sertifikasi" : "Certifications"}
          </h2>
        </div>
        <div className="h-[520px] md:h-[640px]">
          <DriftWall
            items={items}
            columns={5}
            tileWidth={210}
            tileHeight={148}
            gap={18}
            tilt={14}
            turn={-10}
            perspective={1200}
            depth={100}
            speed={34}
            direction="up"
            variance={0.4}
            parallax={0.45}
            lift={58}
            fade={0.58}
            dim={0.7}
            overlayColor="#050505"
            onItemClick={(item) => setSelected({ image: item.image, title: item.title ?? "Certificate", credentialUrl: item.credentialUrl ?? "#" })}
          />
        </div>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div className="certificate-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <motion.div className="certificate-lightbox__content" onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 28, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
              <button type="button" className="certificate-lightbox__close" onClick={() => setSelected(null)} aria-label={lang === "ID" ? "Tutup" : "Close"}>
                <X size={20} />
              </button>
              <motion.div className="certificate-lightbox__image" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08, duration: 0.35 }}>
                <Image src={selected.image} alt={selected.title} fill sizes="(max-width: 768px) 94vw, 900px" className="object-contain" priority />
              </motion.div>
              <div className="certificate-lightbox__footer">
                <p className="certificate-lightbox__title">{selected.title}</p>
                {selected.credentialUrl !== "#" && <a className="certificate-lightbox__credential" href={selected.credentialUrl} target="_blank" rel="noreferrer noopener">{lang === "ID" ? "Kredensial" : "Credential"}</a>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
