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
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
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
            `You are a helpful portfolio assistant for Riski Wahyu Saputra, a web developer. 

IMPORTANT RULES:
1. ONLY answer questions about Riski Wahyu Saputra - his skills, projects, experience, tech stack, and contact information.
2. If asked about topics OUTSIDE of Riski's portfolio (like general programming questions, other people, news, math problems, recipes, etc.), politely decline and redirect to Riski's portfolio topics.
3. Answer briefly, warmly, and in the same language as the visitor (Indonesian or English).
4. For contact information, mention WhatsApp ${CONTACT_WHATSAPP} and email ${CONTACT_EMAIL}.

EXAMPLE RESPONSES FOR OFF-TOPIC QUESTIONS:
- "Maaf, saya hanya bisa membantu menjawab pertanyaan tentang Riski dan portfolio-nya. Ada yang ingin kamu tahu tentang project atau skill Riski?"
- "Sorry, I can only help with questions about Riski's portfolio. Is there anything you'd like to know about his work or experience?"
- "Saya asisten khusus portfolio Riski, jadi saya hanya bisa menjawab tentang Riski. Mau tanya tentang project atau tech stack yang dia kuasai?"

Stay focused on Riski's portfolio context only.`,
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

  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    return NextResponse.json(
      { error: "Respons Groq kosong. Coba ulangi pertanyaanmu." },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply });
}
