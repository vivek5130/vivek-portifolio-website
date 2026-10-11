/**
 * Single source of truth for portfolio content.
 * Everything here is taken from the résumé — edit this file to update the site.
 */

export const profile = {
  firstName: "Ganathe",
  lastName: "Vivek",
  role: "Full Stack AI Engineer",
  location: "Hyderabad, India",
  coords: "17.38°N · 78.48°E",
  email: "vivekganathe@gmail.com",
  phone: "+91 82474 98688",
  phoneHref: "tel:+918247498688",
  resume: "/Vivek_Ganathe_Resume.pdf",
  status: "Software Development Engineer @ Zithara.AI",
  summary:
    "I build AI-powered, production-grade products end to end — from React interfaces and Node services to LangChain agents, RAG pipelines and vector search. My work turns natural language into reports, conversations into resolved tickets, and spreadsheets into insight.",
  links: {
    github: "https://github.com/vivek5130",
    linkedin: "https://www.linkedin.com/in/vivekganathe/",
    leetcode: "https://leetcode.com/u/vivek5130/",
  },
} as const;

export type NavItem = { id: string; label: string; index: string };

export const sections: NavItem[] = [
  { id: "hero", label: "Index", index: "00" },
  { id: "about", label: "About", index: "01" },
  { id: "experience", label: "Experience", index: "02" },
  { id: "projects", label: "Projects", index: "03" },
  { id: "skills", label: "Skills", index: "04" },
  { id: "education", label: "Education", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];

export type Metric = { value: number; suffix: string; label: string; source: string };

/** Measured outcomes from shipped work. */
export const metrics: Metric[] = [
  { value: 70, suffix: "%", label: "less manual reporting", source: "NL2SQL engine" },
  { value: 60, suffix: "%", label: "lift in engagement", source: "Instagram automation" },
  { value: 50, suffix: "%", label: "lower handling time", source: "Conversational AI agents" },
  { value: 350, suffix: "+", label: "DSA problems · top 10%", source: "LeetCode" },
];

export type Track = "genai" | "growth" | "platform";

export const trackMeta: Record<Track, { label: string; blurb: string }> = {
  genai: { label: "GenAI & RAG", blurb: "LLM agents, retrieval and code generation" },
  growth: { label: "Meta & Growth", blurb: "Graph API, ads and messaging automation" },
  platform: { label: "Platform", blurb: "Multi-tenant infrastructure and data" },
};

export type Achievement = {
  title: string;
  detail: string;
  track: Track;
  impact?: string;
  stack: string[];
};

export const experience = {
  company: "Zithara.AI",
  role: "Software Development Engineer",
  start: "2025-05-01",
  period: "May 2025 — Present",
  location: "Hyderabad",
  context: "AI-first CRM platform for retail brands",
  achievements: [
    {
      title: "NL2SQL reporting engine",
      detail:
        "Built an AI-powered natural-language-to-SQL reporting engine with LangChain and RAG pipelines so businesses generate dynamic CRM reports just by asking.",
      track: "genai",
      impact: "−70% manual reporting",
      stack: ["LangChain", "RAG", "PostgreSQL"],
    },
    {
      title: "Omnichannel conversational agents",
      detail:
        "Engineered scalable conversational AI agents with vector databases, semantic search and RAG retrieval — powering both agent-assist suggestions and fully autonomous customer replies.",
      track: "genai",
      impact: "−50% avg. handling time",
      stack: ["LangChain", "Qdrant", "Semantic search"],
    },
    {
      title: "Excel insights engine",
      detail:
        "Developed an engine that analyses uploaded spreadsheets and uses dynamic code generation to render contextual visualisations from natural-language questions.",
      track: "genai",
      impact: "−70% manual reporting",
      stack: ["LLM codegen", "Python", "Charts"],
    },
    {
      title: "GenAI WhatsApp templates",
      detail:
        "Designed and built end-to-end WhatsApp template generation using Generative AI, from prompt design to approval-ready output.",
      track: "genai",
      stack: ["GenAI", "Prompt engineering", "React"],
    },
    {
      title: "Instagram automation",
      detail:
        "Built Instagram automation on the Meta Graph API with LangChain-driven custom bot flows for brand conversations.",
      track: "growth",
      impact: "+60% engagement",
      stack: ["Meta Graph API", "LangChain", "Node.js"],
    },
    {
      title: "Meta Ads, Conversion API and Custom Audiences",
      detail:
        "Integrated Meta Ads, built custom audiences through segmentation, and wired the Offline Conversion API to track conversions and ad performance.",
      track: "growth",
      stack: ["Meta Ads", "Conversion API", "Segmentation"],
    },
    {
      title: "Multi-tenant email builder",
      detail:
        "Developed a drag-and-drop email template builder on GrapeJS and AWS SES, enabling campaign management across many business tenants.",
      track: "platform",
      stack: ["GrapeJS", "AWS SES", "Multi-tenant"],
    },
    {
      title: "Bulk import pipeline",
      detail:
        "Optimised CRM data import and processing workflows, removing bottlenecks for large operational datasets.",
      track: "platform",
      stack: ["Node.js", "PostgreSQL", "Batching"],
    },
  ] satisfies Achievement[],
};

export type ProjectKind = "nl2sql" | "agents" | "insights" | "shopping" | "exam" | "agri";

export type Project = {
  id: ProjectKind;
  code: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  outcome: string;
  context: string;
  href?: string;
  hrefLabel?: string;
};

export const projects: Project[] = [
  {
    id: "nl2sql",
    code: "SYS-01",
    title: "NL2SQL Reporting Engine",
    tagline: "Ask the CRM a question, get a report.",
    description:
      "Schema-aware retrieval feeds an LLM that writes, validates and runs SQL — turning plain-English questions into live reports for business users.",
    stack: ["LangChain", "RAG", "PostgreSQL", "Node.js"],
    outcome: "70% less manual reporting",
    context: "Zithara.AI · production",
  },
  {
    id: "agents",
    code: "SYS-02",
    title: "Omnichannel AI Agents",
    tagline: "One brain across WhatsApp, Instagram and web.",
    description:
      "Retrieval-augmented agents over a vector store answer customers autonomously or suggest replies to human agents, grounded in brand knowledge.",
    stack: ["LangChain", "Qdrant", "Semantic search", "Meta Graph API"],
    outcome: "50% lower handling time",
    context: "Zithara.AI · production",
  },
  {
    id: "insights",
    code: "SYS-03",
    title: "Excel Insights Engine",
    tagline: "Spreadsheets in, charts out.",
    description:
      "Upload a sheet, ask in natural language; the engine generates analysis code on the fly and renders contextual visualisations.",
    stack: ["LLM codegen", "Python", "React"],
    outcome: "70% less manual reporting",
    context: "Zithara.AI · production",
  },
  {
    id: "shopping",
    code: "LAB-04",
    title: "Virtual Shopping Assistant",
    tagline: "A voice-ready shopping concierge.",
    description:
      "Context-aware conversational workflows on the Gemini API deliver personalised product recommendations, with speech recognition for hands-free browsing.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Gemini"],
    outcome: "Live demo",
    context: "Personal project · 2023",
    href: "https://virtual-assistant-frontend-sigma.vercel.app/",
    hrefLabel: "Open live demo",
  },
  {
    id: "exam",
    code: "LAB-05",
    title: "Exam Automation System",
    tagline: "NLP that grades written answers.",
    description:
      "Text-similarity algorithms and custom NLP models (NLTK, Transformers) evaluate descriptive answers. Architecture and results published as a research paper.",
    stack: ["Python", "Django", "NLTK", "Transformers"],
    outcome: "80% faster · 85% accuracy",
    context: "Final-year research · 2024–25",
    href: "https://github.com/vivek5130/Exam-system-automation",
    hrefLabel: "View source",
  },
  {
    id: "agri",
    code: "LAB-06",
    title: "AI for Farmers",
    tagline: "Agricultural intelligence for the field.",
    description:
      "An AI-driven agricultural solution built under hackathon pressure, recognised with a Special Mention at a regional hackathon.",
    stack: ["Python", "ML", "Rapid prototyping"],
    outcome: "Hackathon special mention",
    context: "Regional hackathon",
  },
];

export type SkillGroup = { id: string; label: string; icon: IconName; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    label: "AI & GenAI",
    icon: "brain",
    items: ["LangChain", "LangGraph", "RAG", "Prompt engineering", "Hugging Face", "TensorFlow", "Semantic search"],
  },
  {
    id: "languages",
    label: "Languages",
    icon: "code",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C / C++", "SQL"],
  },
  {
    id: "web",
    label: "Full Stack",
    icon: "layers",
    items: ["React", "Next.js", "Node.js", "Express", "REST APIs", "Django"],
  },
  {
    id: "data",
    label: "Data & Cloud",
    icon: "database",
    items: ["PostgreSQL", "MongoDB", "DynamoDB", "Qdrant", "AWS Lambda", "AWS SES", "Serverless"],
  },
  {
    id: "ops",
    label: "Delivery",
    icon: "workflow",
    items: ["Docker", "Git", "CI/CD", "Agile / SDLC", "OOP & design patterns"],
  },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering (AI & ML)",
  school: "St. Mary's Engineering College",
  city: "Hyderabad",
  period: "Nov 2021 — Aug 2025",
  coursework: ["Artificial Intelligence", "Machine Learning", "Data Structures & Algorithms", "Database Management", "Cloud Computing", "Java (OOP)"],
};

export type Credential = { title: string; issuer: string; kind: "cert" | "award" | "paper" | "rank"; icon: IconName };

export const credentials: Credential[] = [
  { title: "AWS Cloud Practitioner Essentials", issuer: "Amazon Web Services", kind: "cert", icon: "cloud" },
  { title: "Google Data Analytics Certificate", issuer: "Google · Coursera", kind: "cert", icon: "chart" },
  { title: "Research paper — automated exam evaluation", issuer: "Published · NLP", kind: "paper", icon: "paper" },
  { title: "Special Mention, regional hackathon", issuer: "AI for agriculture", kind: "award", icon: "trophy" },
  { title: "LeetCode top 10% · 350+ problems", issuer: "Data structures & algorithms", kind: "rank", icon: "target" },
  { title: "Exceptional Oration Award", issuer: "Green Corps", kind: "award", icon: "mic" },
];

/** Pre-written answers for the "query the model" console in About. */
export const consolePrompts: { q: string; a: string }[] = [
  {
    q: "Why should we hire Vivek?",
    a: "He ships AI to production, not just to notebooks. At Zithara.AI he built an NL2SQL engine (−70% manual reporting), RAG agents (−50% handling time) and Meta automation (+60% engagement) — while owning the React and Node layers around them.",
  },
  {
    q: "What does he build best?",
    a: "Retrieval-augmented systems with a real product around them: LangChain / LangGraph orchestration, Qdrant vector search, PostgreSQL, and clean React / Next.js interfaces people actually use.",
  },
  {
    q: "How does he work in a team?",
    a: "Agile, communicative, detail-oriented. Strong in OOP and design patterns, comfortable across the SDLC, and award-winning at explaining things — he holds an Exceptional Oration Award.",
  },
  {
    q: "Is he available?",
    a: "Yes — open to full-time Full Stack / AI Engineer roles. Based in Hyderabad, India. Fastest channel: vivekganathe@gmail.com.",
  },
];

export type IconName =
  | "brain" | "code" | "layers" | "database" | "workflow" | "cloud" | "chart" | "paper"
  | "trophy" | "target" | "mic" | "mail" | "phone" | "pin" | "github" | "linkedin"
  | "leetcode" | "download" | "arrow" | "external" | "spark" | "command" | "copy" | "check"
  | "cap" | "bolt" | "chat" | "search" | "close" | "menu";
