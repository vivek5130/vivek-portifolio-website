/**
 * What the chat assistant knows. Résumé facts are pulled from `data.ts`;
 * add anything else you want the bot to know to `extraContext` below.
 */
import { credentials, education, experience, profile, projects, skillGroups } from "./data";

/**
 * ✏️ Your own notes for the assistant — preferences, availability, stories,
 * things not on the résumé. Plain text; keep it factual.
 */
export const extraContext = `
- Open to full-time Full Stack / AI Engineer roles.
- Enjoys building products where LLMs meet real users: retrieval, agents, and clean UX around them.
- Strong communicator — won an Exceptional Oration Award; comfortable presenting technical work.
`;

/** Pre-written answers shown as quick-reply buttons (no AI call needed). */
export const quickReplies: { q: string; a: string; keywords: string[] }[] = [
  {
    q: "Why hire Vivek?",
    a: "He ships AI to production. At Zithara.AI he built an NL2SQL reporting engine (−70% manual reporting), RAG-powered conversational agents (−50% handling time) and Instagram automation (+60% engagement) — and owns the React / Node layers around them too.",
    keywords: ["hire", "why", "strength", "fit", "value"],
  },
  {
    q: "What's his tech stack?",
    a: "AI: LangChain, LangGraph, RAG, Hugging Face, TensorFlow. Web: React, Next.js, Node.js, Express, Django. Data & cloud: PostgreSQL, MongoDB, DynamoDB, Qdrant, AWS Lambda / SES. Languages: TypeScript, JavaScript, Python, Java, C/C++.",
    keywords: ["stack", "tech", "skill", "language", "framework", "tool", "vector", "database", "qdrant", "langchain", "rag", "llm", "react", "next", "node", "python", "aws", "cloud", "sql"],
  },
  {
    q: "What did he build at Zithara.AI?",
    a: "As a Software Development Engineer (May 2025 – present): an NL2SQL reporting engine, omnichannel RAG agents, an AI Excel insights engine, GenAI WhatsApp templates, Instagram automation on the Meta Graph API, Meta Ads custom audiences, a multi-tenant GrapeJS + AWS SES email builder, and faster bulk CRM imports.",
    keywords: ["zithara", "work", "experience", "job", "current", "company", "nl2sql", "agent", "instagram", "whatsapp", "meta", "crm", "production"],
  },
  {
    q: "Show me his projects",
    a: "Highlights: NL2SQL Reporting Engine, Omnichannel AI Agents and an Excel Insights Engine (all in production at Zithara.AI); a Gemini-powered Virtual Shopping Assistant with speech input; and an NLP Exam Automation System (85% accuracy, published as a research paper). Scroll to Projects for details and links.",
    keywords: ["project", "built", "portfolio", "demo", "github", "shopping", "exam", "research", "paper", "hackathon"],
  },
  {
    q: "Education & certifications?",
    a: "B.Tech in Computer Science & Engineering (AI & ML) from St. Mary's Engineering College, Hyderabad (2021–2025). Certified in AWS Cloud Practitioner Essentials and the Google Data Analytics Certificate. LeetCode top 10% with 400+ problems solved.",
    keywords: ["education", "degree", "college", "certificate", "certification", "study", "leetcode"],
  },
  {
    q: "How can I contact him?",
    a: `Email ${profile.email} or call ${profile.phone}. He's also on LinkedIn (linkedin.com/in/vivekganathe) and GitHub (github.com/vivek5130). He's based in ${profile.location} and open to full-time roles.`,
    keywords: ["contact", "email", "phone", "reach", "available", "availability", "linkedin"],
  },
];

/** Keyword match used when the AI endpoint is unavailable. */
export function localAnswer(question: string) {
  const q = question.toLowerCase();
  let best: { score: number; a: string } = { score: 0, a: "" };
  for (const r of quickReplies) {
    const score = r.keywords.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0);
    if (score > best.score) best = { score, a: r.a };
  }
  return (
    best.a ||
    `I can't reach the AI model right now, but Vivek would be happy to answer directly — email ${profile.email}. Meanwhile, try one of the quick questions below.`
  );
}

/** Full résumé as plain text, injected into the system prompt. */
export function resumeContext() {
  const lines = [
    `# ${profile.firstName} ${profile.lastName} — ${profile.role}`,
    `Location: ${profile.location}. Email: ${profile.email}. Phone: ${profile.phone}.`,
    `Links: GitHub ${profile.links.github}, LinkedIn ${profile.links.linkedin}, LeetCode ${profile.links.leetcode}. Resume PDF on this site: ${profile.resume}.`,
    `Summary: ${profile.summary}`,
    "",
    `## Experience — ${experience.company}, ${experience.location} (${experience.period})`,
    `${experience.company}: ${experience.context}. Joined as an intern and was converted to full-time.`,
    ...experience.roles.flatMap((r) => [
      `### ${r.title} — ${r.type}, ${r.period}. Focus: ${r.focus}`,
      ...r.highlights.map((h) => `- ${h.title}: ${h.text}${h.impact ? ` Impact: ${h.impact}.` : ""} Stack: ${h.stack.join(", ")}.`),
    ]),
    "",
    "## Projects",
    ...projects.map((p) => `- ${p.title} (${p.context}): ${p.description} Stack: ${p.stack.join(", ")}. Outcome: ${p.outcome}.${p.href ? ` Link: ${p.href}` : ""}`),
    "",
    "## Skills",
    ...skillGroups.map((g) => `- ${g.label}: ${g.items.join(", ")}`),
    "",
    `## Education — ${education.degree}, ${education.school}, ${education.city} (${education.period})`,
    `Coursework: ${education.coursework.join(", ")}.`,
    "",
    "## Certifications & achievements",
    ...credentials.map((c) => `- ${c.title} — ${c.issuer}`),
    "",
    "## Additional notes from Vivek",
    extraContext.trim(),
  ];
  return lines.join("\n");
}
