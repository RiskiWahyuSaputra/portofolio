"use client";

import DomeGallery from "./DomeGallery";

const techStackImages = [
  { src: "https://cdn.simpleicons.org/react/61DAFB", alt: "React" },
  { src: "https://cdn.simpleicons.org/nextdotjs/ffffff", alt: "Next.js" },
  { src: "https://cdn.simpleicons.org/typescript/3178C6", alt: "TypeScript" },
  { src: "https://cdn.simpleicons.org/vite/646CFF", alt: "Vite" },
  { src: "https://cdn.simpleicons.org/tailwindcss/06B6D4", alt: "Tailwind CSS" },
  { src: "https://cdn.simpleicons.org/javascript/F7DF1E", alt: "JavaScript" },
  { src: "https://cdn.simpleicons.org/laravel/FF2D20", alt: "Laravel" },
  { src: "https://cdn.simpleicons.org/codeigniter/EF4223", alt: "CodeIgniter" },
  { src: "https://cdn.simpleicons.org/php/777BB4", alt: "PHP" },
  { src: "https://cdn.simpleicons.org/mysql/4479A1", alt: "MySQL" },
  { src: "https://cdn.simpleicons.org/microsoftsqlserver/CC2927", alt: "SQL Server" },
  { src: "https://cdn.simpleicons.org/github/ffffff", alt: "GitHub" },
  { src: "https://cdn.simpleicons.org/ubuntu/E95420", alt: "Ubuntu" },
  { src: "https://cdn.simpleicons.org/stripe/00897B", alt: "Midtrans" },
  { src: "https://cdn.simpleicons.org/whatsapp/25D366", alt: "WhatsApp API" },
  { src: "https://cdn.simpleicons.org/googlegemini/4285F4", alt: "Gemini API" },
  { src: "https://cdn.simpleicons.org/groq/F55036", alt: "Groq API" },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full h-screen md:h-[600px] bg-[#0a0a0a] overflow-hidden"
    >
      <DomeGallery
        images={techStackImages}
        overlayBlurColor="#0a0a0a"
        grayscale={false}
        imageBorderRadius="20px"
        openedImageBorderRadius="20px"
        openedImageWidth="280px"
        openedImageHeight="280px"
        segments={25}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </section>
  );
}
