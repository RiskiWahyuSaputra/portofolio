"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useLang } from "./LangContext";

type Project = {
  number: string;
  title: string;
  image: string;
  demoUrl: string;
  description: { EN: string; ID: string };
  tech: string[];
  features: { EN: string; ID: string }[];
};

const projects: Project[] = [
  {
    number: "01",
    title: "StockFlow Commerce",
    image: "/projects/project-01.png",
    demoUrl: "#",
    description: {
      EN: "A full-featured E-Commerce platform with product catalog, shopping cart, Midtrans payment integration, admin dashboard, and real-time inventory tracking.",
      ID: "Platform E-Commerce lengkap dengan katalog produk, keranjang belanja, integrasi pembayaran Midtrans, dashboard admin, dan pelacakan inventaris real-time.",
    },
    tech: ["Laravel", "MySQL", "Tailwind"],
    features: [
      { EN: "Product catalog", ID: "Katalog produk" },
      { EN: "Cart system", ID: "Sistem keranjang" },
      { EN: "Midtrans payment", ID: "Pembayaran Midtrans" },
      { EN: "Admin dashboard", ID: "Dashboard admin" },
      { EN: "Inventory tracking", ID: "Pelacakan inventaris" },
    ],
  },
  {
    number: "02",
    title: "School Management System",
    image: "/projects/project-02.png",
    demoUrl: "#",
    description: {
      EN: "Comprehensive school management solution handling student enrollment, attendance tracking, academic records, and a dedicated parent portal.",
      ID: "Solusi manajemen sekolah komprehensif yang menangani pendaftaran siswa, pelacakan kehadiran, catatan akademik, dan portal orang tua khusus.",
    },
    tech: ["CodeIgniter", "PHP", "MySQL", "Bootstrap"],
    features: [
      { EN: "Student system", ID: "Sistem siswa" },
      { EN: "Attendance", ID: "Kehadiran" },
      { EN: "Academic records", ID: "Catatan akademik" },
      { EN: "Parent portal", ID: "Portal orang tua" },
    ],
  },
  {
    number: "03",
    title: "Smart Resource Optimizer",
    image: "/projects/project-07.png",
    demoUrl: "#",
    description: {
      EN: "A web-based platform that connects restaurants/businesses with surplus food to communities in need. This application facilitates efficient food sharing through a real-time claim and verification system.",
      ID: "Platform berbasis web yang menghubungkan restoran/bisnis dengan kelebihan makanan kepada komunitas yang membutuhkan. Aplikasi ini memfasilitasi pembagian makanan yang efisien melalui sistem klaim dan verifikasi real-time.",
    },
    tech: [
      "Laravel 11",
      "Laravel Reverb",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "MySQL",
      "React leaflet",
      "Vite",
    ],
    features: [
      { EN: "Manajemen user", ID: "Manajemen user" },
      { EN: "Food posting", ID: "Posting makanan" },
      { EN: "Food claiming", ID: "Klaim makanan" },
      { EN: "Real-time updates", ID: "Pembaruan real-time" },
      { EN: "Geolocation", ID: "Geolokasi" },
      { EN: "Admin dashboard", ID: "Dashboard admin" },
    ],
  },

  {
    number: "04",
    title: "TokoQ - UMKM E-Commerce Platform",
    image: "/projects/project-08.png",
    demoUrl: "#",
    description: {
      EN: "TokoQ-UMKM is an e-commerce and digital store management platform specifically designed for MSMEs (Micro, Small, and Medium Enterprises) in Indonesia.",
      ID: "TokoQ-UMKM adalah platform e-commerce dan manajemen toko digital yang dirancang khusus untuk UMKM (Usaha Mikro, Kecil, dan Menengah) di Indonesia.",
    },
    tech: ["Laravel", "Vite ", "Tailwind CSS", "Vanilla JavaScript/ES Modules"],
    features: [
      { EN: "Barcode scanning", ID: "Pemindaian barcode" },
      { EN: "Multi warehouse", ID: "Multi gudang" },
      { EN: "Stock alerts", ID: "Peringatan stok" },
      { EN: "REST API", ID: "REST API" },
    ],
  },

  {
    number: "05",
    title: "KlinikQ - Clinic Management System",
    image: "/projects/project-09.png",
    demoUrl: "#",
    description: {
      EN: "A complete clinic management application that allows clinic staff to manage patients, doctors, schedules, appointments, medical records, prescriptions, payments, and public content (articles/news). This system is built for internal clinic use with a Blade-based interface, structured API for integration, as well as notification and reporting functions.",
      ID: "Aplikasi manajemen klinik lengkap yang memungkinkan staf klinik mengelola pasien, dokter, jadwal, janji temu, rekam medis, resep, pembayaran, dan konten publik (artikel/berita). Sistem ini dibangun untuk penggunaan internal klinik dengan berbasis Blade, API terstruktur untuk integrasi, serta fungsi notifikasi dan pelaporan.",
    },
    tech: ["Laravel 12", "PHP 8.2", "Vite", "Tailwind CSS 4", "MySQL", "Git"],
    features: [
      {
        EN: "Patient Management: Patient CRUD, integrated medical records, visit history.",
        ID: "Manajemen Pasien: CRUD pasien, rekam medis terintegrasi, riwayat kunjungan.",
      },
      {
        EN: "Doctor & Service Management: Doctor profiles, specializations, service/fee configurations.",
        ID: "Manajemen Dokter & Layanan: Profil dokter, spesialisasi, konfigurasi layanan/biaya.",
      },
      {
        EN: "Scheduling and Appointments: Doctor's schedule calendar, patient appointment booking, status (confirmed/cancelled).",
        ID: "Penjadwalan dan Janji Temu: Kalender jadwal dokter, pemesanan janji temu pasien, status (dikonfirmasi/dibatalkan).",
      },
      {
        EN: "Medical Record & Prescription Form: Recording diagnosis, examination results, printing/generating prescriptions.",
        ID: "Rekam Medis & Formulir Resep: Pencatatan diagnosis, hasil pemeriksaan, pencetakan/pembuatan resep.",
      },
      {
        EN: "Notifications: In-app notifications for appointment confirmations and reminders, as well as a notification system for staff.",
        ID: "Notifikasi: Notifikasi dalam aplikasi untuk konfirmasi dan pengingat janji temu, serta sistem notifikasi untuk staf.",
      },
      {
        EN: "Content Management: Article/news module for publishing health information.",
        ID: "Manajemen Konten: Modul artikel/berita untuk menerbitkan informasi kesehatan.",
      },
      {
        EN: "Authentication & Authorization: Login, role/permission management (admin, receptionist, doctor).",
        ID: "Autentikasi & Otorisasi: Login, manajemen role/izin (admin, resepsionis, dokter).",
      },
    ],
  },

  {
    number: "06",
    title: "Faste Coffee Shop Landing Page",
    image: "/projects/project-06.png",
    demoUrl: "https://faste-coffe.vercel.app/",
    description: {
      EN: "A modern landing page for Faste Coffee Shop focused on brand storytelling, smooth scrolling interactions, and a polished mobile-first browsing experience.",
      ID: "Landing page modern untuk Faste Coffee Shop yang berfokus pada penceritaan merek, interaksi scroll yang halus, dan pengalaman browsing mobile-first yang elegan.",
    },
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Lenis"],
    features: [
      { EN: "Brand storytelling", ID: "Penceritaan merek" },
      { EN: "Smooth scrolling", ID: "Scroll halus" },
      { EN: "Responsive layout", ID: "Tata letak responsif" },
      { EN: "Interactive sections", ID: "Bagian interaktif" },
    ],
  },

  {
    number: "07",
    title: "replacement practicum payment based on QRIS (POLINELA)",
    image: "/projects/project-04.png",
    demoUrl: "#",
    description: {
      EN: "Development of a substitute practicum payment application using QRIS for the Information Technology Department of Lampung State Polytechnic.",
      ID: "Pengembangan aplikasi pembayaran pengganti praktikum berbasis QRIS untuk Jurusan Teknologi Informasi Politeknik Negeri Lampung.",
    },
    tech: ["CodeIgniter", "PHP", "MySQL", "Bootstrap"],
    features: [
      { EN: "QRIS payment flow", ID: "Alur pembayaran QRIS" },
      { EN: "Practicum billing", ID: "Penagihan praktikum" },
      { EN: "Payment verification", ID: "Verifikasi pembayaran" },
      { EN: "Admin management", ID: "Manajemen admin" },
    ],
  },
  {
    number: "08",
    title: "Anemia Care — Informasi Kesehatan untuk Ibu Hamil",
    image: "/projects/project-10.png",
    demoUrl: "#",
    description: {
      EN: "An educational site that provides a complete explanation about anemia in pregnant women, from causes, symptoms, complications, prevention, to ways to overcome it for the health of the mother and fetus.",
      ID: "Situs edukasi yang memberikan penjelasan lengkap tentang anemia pada ibu hamil, mulai dari penyebab, gejala, komplikasi, pencegahan, hingga cara mengatasinya demi kesehatan ibu dan janin.",
    },
    tech: ["HTML", "CSS", "Bootstrap", "Font Awesome", "PHP", "MySQL"],
    features: [
      {
        EN: "Homepage with a hero section and a summary of anemia information",
        ID: "Halaman beranda dengan hero section dan ringkasan informasi anemia",
      },
      {
        EN: "Responsive navigation for quick access to main topics",
        ID: "Navigasi responsif untuk akses cepat ke topik utama",
      },
      {
        EN: "Structured educational content: causes, symptoms, complications, prevention, and ways to overcome",
        ID: "Konten edukasi terstruktur: penyebab, tanda & gejala, komplikasi, pencegahan, dan cara mengatasi",
      },
      {
        EN: "Interactive navigation cards for easy exploration of topics",
        ID: "Kartu navigasi interaktif untuk memudahkan pengguna menjelajah topik",
      },
      {
        EN: "Important information section with health explanations and quick facts",
        ID: "Seksi informasi penting dengan penjelasan kesehatan dan fakta singkat",
      },
      {
        EN: "Mobile-friendly design with modern layout and clean visuals",
        ID: "Desain mobile-friendly dengan layout modern dan visual bersih",
      },
    ],
  },
  {
    number: "09",
    title: "Interactive Landing Page Home",
    image: "/projects/project-11.png",
    demoUrl: "https://landingpage-home.vercel.app/",
    description: {
      EN: "Implementation of a customer support chat system with queue management, AI chatbot automation, real-time live chat, analytics dashboard, and WhatsApp integration.",
      ID: "Porto Homes adalah landing page properti modern untuk mempromosikan penjualan atau penyewaan rumah. Menonjolkan hero visual, galeri properti, tur interaktif, dan lead capture untuk calon pembeli/penyewa dengan pengalaman performa tinggi dan navigasi mulus.",
    },
    tech: [
      "Next.js",
      "Tailwind CSS",
      "Post CSS",
      "TypeScript",
      " custom sequence/scroll components",
    ],
    features: [
      {
        EN: "Queue management",
        ID: "Hero interaktif dengan call-to-action (lihat properti / hubungi)",
      },
      { EN: "AI chatbot", ID: "Galeri properti responsif (foto, lightbox)" },
      {
        EN: "WhatsApp integration",
        ID: "Sequence/timeline showcase unit (fitur unggulan, harga, spesifikasi)",
      },
      {
        EN: "Realtime live chat",
        ID: "Virtual tour / embedded video atau 3D viewer",
      },
      {
        EN: "Analytics dashboard",
        ID: "Preloader & smooth scroll untuk pengalaman halus",
      },
      {
        EN: "Analytics dashboard",
        ID: "Fullscreen menu navigasi untuk sections properti",
      },
      {
        EN: "Analytics dashboard",
        ID: "Magnetic CTA dan progress indicator pada scroll sequence",
      },
    ],
  },
  {
    number: "10",
    title: "Customer Support Chat System",
    image: "/projects/project-05.svg",
    demoUrl: "#",
    description: {
      EN: "Implementation of a customer support chat system with queue management, AI chatbot automation, real-time live chat, analytics dashboard, and WhatsApp integration.",
      ID: "Implementasi sistem chat dukungan pelanggan dengan manajemen antrian, otomasi chatbot AI, live chat real-time, dashboard analitik, dan integrasi WhatsApp.",
    },
    tech: [
      "Laravel 12",
      "PHP 8.2",
      "Tailwind CSS 4",
      "Alpine.js",
      "Laravel Reverb",
      "MySQL",
      "Gemini API",
    ],
    features: [
      { EN: "Queue management", ID: "Manajemen antrian" },
      { EN: "AI chatbot", ID: "Chatbot AI" },
      { EN: "WhatsApp integration", ID: "Integrasi WhatsApp" },
      { EN: "Realtime live chat", ID: "Live chat real-time" },
      { EN: "Analytics dashboard", ID: "Dashboard analitik" },
    ],
  },
  {
    number: "11",
    title: "Qbox - Photobox Pixel",
    image: "/projects/project-12.png",
    demoUrl: "#",
    description: {
      EN: "PhotoBox is a simple website for creating and managing creative photos with a modern and user-friendly style. Users can choose templates, add filters, and download the resulting photos directly from the browser.",
      ID: "PhotoBox adalah website sederhana untuk membuat dan mengelola foto kreatif dengan gaya modern dan mudah digunakan. Pengguna dapat memilih template, menambahkan filter, serta mengunduh hasil foto langsung dari browser.",
    },
    tech: ["HTML", "CSS", "JavaScript"],
    features: [
      {
        EN: "Photo template options or basic layout",
        ID: "Pilihan template foto atau layout dasar",
      },
      {
        EN: "Visual effects and filters for photos",
        ID: "Efek dan filter visual untuk foto",
      },
      {
        EN: "Live preview before download",
        ID: "Preview langsung sebelum unduh",
      },
      {
        EN: "Download button for result photos",
        ID: "Tombol unduh hasil foto",
      },
      {
        EN: "Responsive for desktop and mobile views",
        ID: "Responsif untuk tampilan desktop dan mobile",
      },
    ],
  },
  {
    number: "12",
    title: "Undangan Digital",
    image: "/projects/project-13.png",
    demoUrl: "#",
    description: {
      EN: "Modern inventory management with barcode scanning, multi-warehouse support, automated stock alerts, and a REST API for integrations.",
      ID: "Manajemen inventaris modern dengan pemindaian barcode, dukungan multi gudang, peringatan stok otomatis, dan REST API untuk integrasi.",
    },
    tech: ["Laravel", "JWT", "MySQL"],
    features: [
      { EN: "Barcode scanning", ID: "Pemindaian barcode" },
      { EN: "Multi warehouse", ID: "Multi gudang" },
      { EN: "Stock alerts", ID: "Peringatan stok" },
      { EN: "REST API", ID: "REST API" },
    ],
  },
];

function ProjectModal({
  project,
  onClose,
  labels,
  lang,
}: {
  project: Project;
  onClose: () => void;
  labels: { demo: string; techStack: string; keyFeatures: string };
  lang: "EN" | "ID";
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 pb-8 px-4 md:px-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111] border border-white/10"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Project image */}
        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-white/30">
                {project.number}
              </span>
              <h3 className="mt-1 text-2xl md:text-3xl font-semibold text-white">
                {project.title}
              </h3>
            </div>
            <a
              href={project.demoUrl}
              target={project.demoUrl.startsWith("http") ? "_blank" : undefined}
              rel={
                project.demoUrl.startsWith("http")
                  ? "noreferrer noopener"
                  : undefined
              }
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white transition-all"
            >
              {labels.demo}
              <ArrowUpRight size={12} />
            </a>
          </div>

          <p className="mt-4 text-base text-white/60 leading-relaxed">
            {project.description[lang]}
          </p>

          {/* Tech stack */}
          <div className="mt-6">
            <h4 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
              {labels.techStack}
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h4 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
              {labels.keyFeatures}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.features.map((feature) => (
                <li
                  key={feature[lang]}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <ArrowUpRight
                    size={12}
                    className="text-white/30 flex-shrink-0"
                  />
                  {feature[lang]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const PER_PAGE = 6;
const MOBILE_INITIAL_COUNT = 3;

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [selected, setSelected] = useState<Project | null>(null);
  const [page, setPage] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const { lang } = useLang();

  const labels = {
    EN: {
      section: "06 / Projects",
      heading: "Featured Work",
      viewDetails: "View Details",
      demo: "Demo",
      techStack: "Tech Stack",
      keyFeatures: "Key Features",
      showAll: "View All Projects",
      showLess: "Show Less",
    },
    ID: {
      section: "06 / Proyek",
      heading: "Karya Unggulan",
      viewDetails: "Lihat Detail",
      demo: "Demo",
      techStack: "Teknologi",
      keyFeatures: "Fitur Utama",
      showAll: "Lihat Semua Proyek",
      showLess: "Tampilkan Lebih Sedikit",
    },
  };
  const lx = labels[lang];

  const totalPages = Math.ceil(projects.length / PER_PAGE);
  const paginated = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const mobileProjects = showAllMobile
    ? projects
    : projects.slice(0, MOBILE_INITIAL_COUNT);

  return (
    <section
      ref={ref}
      id="projects"
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

        {/* Mobile compact list */}
        <div className="grid grid-cols-1 gap-4 sm:hidden">
          {mobileProjects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#111] transition-all duration-300 hover:border-white/15"
              onClick={() => setSelected(project)}
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="100vw"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-white/30">
                      {project.number}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-white">
                      {project.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="mt-1 flex-shrink-0 text-white/30"
                  />
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                  {project.description[lang]}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/55"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 2 && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/30">
                      +{project.tech.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {projects.length > MOBILE_INITIAL_COUNT && (
          <div className="mt-8 flex justify-center sm:hidden">
            <button
              type="button"
              onClick={() => setShowAllMobile((current) => !current)}
              className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-medium uppercase tracking-widest text-white/70 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              {showAllMobile ? lx.showLess : lx.showAll}
            </button>
          </div>
        )}

        {/* Desktop/tablet card grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#111] border border-white/5 hover:border-white/15 transition-all duration-300"
              onClick={() => setSelected(project)}
            >
              {/* Image */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-mono text-white/80 uppercase tracking-widest border border-white/30 rounded-full px-4 py-2">
                    {lx.viewDetails}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-white/30">
                      {project.number}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-white group-hover:text-white/80 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="flex-shrink-0 mt-1 text-white/20 group-hover:text-white/60 transition-colors"
                  />
                </div>

                <p className="mt-2 text-sm text-white/40 leading-relaxed line-clamp-2">
                  {project.description[lang]}
                </p>

                {/* Tech pills — show first 3 */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/50"
                    >
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/30">
                      +{project.tech.length - 3}
                    </span>
                  )}
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
              <ArrowUpRight size={14} className="rotate-[225deg]" />
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
              <ArrowUpRight size={14} className="rotate-45" />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            onClose={() => setSelected(null)}
            labels={lx}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
