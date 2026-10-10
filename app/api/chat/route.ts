import { NextResponse } from "next/server";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type GroqChoice = {
  message?: {
    content?: string;
  };
};

type GroqResponse = {
  choices?: GroqChoice[];
  error?: {
    message?: string;
  };
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "qwen/qwen3.8-27b";
const CONTACT_WHATSAPP = "085789910963";
const CONTACT_EMAIL = "kiik37734@gmail.com";
const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 1200;

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") {
        return false;
      }

      const candidate = message as Partial<ChatMessage>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-MAX_HISTORY)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GROQ_API_KEY belum diset. Tambahkan key Groq di file .env.local.",
      },
      { status: 500 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format request tidak valid." },
      { status: 400 },
    );
  }

  const messages = normalizeMessages(
    typeof body === "object" && body !== null
      ? (body as { messages?: unknown }).messages
      : undefined,
  );

  const requestLang = (typeof body === "object" && body !== null && typeof (body as { lang?: unknown }).lang === "string")
    ? (body as { lang: string }).lang
    : "EN";

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Kirim minimal satu pesan dari user." },
      { status: 400 },
    );
  }

  const groqResponse = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            `You are Kiyu Assistant, a polite, helpful, and friendly portfolio assistant for Riski Wahyu Saputra (Riski / Kiyu / ganteng), an IT Developer at PT Bandung Eco Sinergi Teknologi (BEST CORPORATION SYARIAH).

VISITOR LANGUAGE: The visitor is currently viewing the website in ${requestLang === "ID" ? "Indonesian (Bahasa Indonesia)" : "English"}. You MUST respond naturally and conversationally in that exact language.

ABOUT RISKI WAHYU SAPUTRA:
- Current Role: IT Developer at PT Bandung Eco Sinergi Teknologi (BEST CORPORATION SYARIAH).
- Work Arrangement & Availability:
  - Very flexible with working arrangements: open and ready for Remote / WFH (Work From Home), Hybrid, as well as WFO (Work From Office / On-site).
  - Open for full-time opportunities, collaborations, and freelance projects.
- Education & Background: Diploma in Information Technology from Politeknik Negeri Lampung (Polinela).
- Core Responsibilities:
  1. Internal Web Application Development: Building and scaling enterprise systems using Laravel, PHP, React, Next.js, and MySQL.
  2. Maintenance & Helpdesk Operations: Handling and resolving system maintenance, bug fixes, and operational service requests submitted through incoming IT helpdesk tickets.
- CV / Resume:
  - Riski provides a downloadable CV / Resume in PDF format.
  - When the visitor asks for CV or resume, warmly confirm that his CV is available and let them know they can click the download button right here in the chat or in the About section of the website.
- Tech Stack & Skills:
  - Backend & Core: Laravel (Laravel 11/12), PHP 8.2+, MySQL, REST API, Octane, RoadRunner.
  - Frontend: React, Next.js, TypeScript, Tailwind CSS, AdminLTE, Bootstrap, Framer Motion.
  - Tools & Integrations: Git, Docker, Digital Signatures (E-Sign), PDF engines (DomPDF/FPDF), Barcode/QR generation & scanning.
- Enterprise & Work Projects (BEST CORPORATION SYARIAH):
  - BEST CSO: Customer Service & Operational Platform (partner handling, surat kuasa, QR branch check-in, guest book, chatbot flow, COA & cash reconciliation).
  - Best Arsip: Archive vault & document management (cabinet & vault box hierarchy diagrams, certificate/BPKB legal tracking, instant multi-filter search).
  - Best Finance: Financial operations, serial number redemption recap, departmental expense approvals, supervisor petty cash, and bank mutation syncing.
  - Best Warehouse: Supply chain & warehouse management (multi-warehouse stock tracking, stocktaking/SO, QC goods receipt with box numbering, outbound orders, inter-warehouse transfers, barcode/serial tracking, and stockist transactions).
  - Sekretariat: Enterprise document management, official digital signatures (E-Sign), seminar attendance verification, consignment workflows, and vendor submissions.
  - DKP: Internal communication, marketing administration, and promotional campaign portal for Divisi Komunikasi dan Pemasaran.
- Contact Details:
  - WhatsApp: ${CONTACT_WHATSAPP}
  - Email: ${CONTACT_EMAIL}

BEHAVIOR GUIDELINES & BOUNDARIES:
1. FOCUS & RELEVANCE: Answer questions relating to Riski Wahyu Saputra—his background, work preferences (Remote / WFH / WFO), role as IT Developer at PT Bandung Eco Sinergi Teknologi, projects, technical skills, maintenance/helpdesk experience, CV/resume, and contact channels.
2. CV / RESUME REQUESTS: When asked about CV or resume, provide a brief friendly note such as: "Tentu, kamu bisa langsung mengunduh CV Riski melalui tombol download di bawah ini." or "Sure! You can download Riski's CV using the download button below." (a download button will be rendered automatically in the chat).
3. WORK PREFERENCES (WFH/WFO/REMOTE): If asked about work arrangements, clearly and warmly state that Riski is very adaptable and open to both Remote/WFH (Work From Home) as well as WFO (Work From Office) or Hybrid.
4. OUT-OF-CONTEXT / OFF-TOPIC HANDLING:
   If a user asks about anything outside Riski's portfolio (e.g. general coding tutorials/homework, general trivia, politics, recipes, weather, other people, or unrelated AI tasks), you must decline GENTLY and POLITELY with empathy, and guide them back warmly to Riski's work and experience.
   - Example tone (ID): "Maaf ya, sebagai asisten portofolio, saat ini saya khusus membantu menjawab hal-hal seputar profil, proyek, keahlian, dan pekerjaan Riski di PT Bandung Eco Sinergi Teknologi. Ada yang ingin kamu ketahui tentang karya atau pengalaman Riski?"
   - Example tone (EN): "I'm sorry, but as Riski's portfolio assistant, I can only help with questions regarding his background, projects, skills, and work at PT Bandung Eco Sinergi Teknologi. Is there anything specific you would like to know about Riski's work or experience?"
5. TONE & STYLE: Keep replies concise, warm, professional, humble, and polite. Avoid robotic repetition or harsh rejections.
6. FORMATTING RULE: NEVER use markdown bold syntax (like **text**) or any other markdown formatting symbols (no asterisks **, no bullet symbols *, no hashes #). Output plain, clean, readable text only. Do not wrap words in asterisks.`,
        },
        ...messages,
      ],
      temperature: 0.6,
      max_completion_tokens: 600,
      top_p: 0.95,
      stream: false,
    }),
  });

  const data = (await groqResponse.json().catch(() => null)) as
    | GroqResponse
    | null;

  if (!groqResponse.ok) {
    return NextResponse.json(
      {
        error:
          data?.error?.message ??
          "Groq API sedang tidak bisa merespons. Coba lagi sebentar.",
      },
      { status: groqResponse.status },
    );
  }

  function cleanText(text: string) {
    return text.replace(/\*\*/g, "").replace(/\*/g, "").trim();
  }

  const reply = cleanText(data?.choices?.[0]?.message?.content ?? "");

  if (!reply) {
    return NextResponse.json(
      { error: "Respons Groq kosong. Coba ulangi pertanyaanmu." },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply });
}
