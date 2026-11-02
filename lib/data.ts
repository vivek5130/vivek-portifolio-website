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
    // "I build AI-powered, production-grade products end to end — from React interfaces and Node services to LangChain agents, RAG pipelines and vector search. My work turns natural language into reports, conversations into resolved tickets, and spreadsheets into insight.",
    "I'm a Full Stack AI Engineer passionate about solving real-world problems through technology. I focus on backend engineering, AI agents, and automation, building practical solutions that make complex processes simpler. I'm a constant learner who enjoys exploring new technologies.",
  // "I'm a Full Stack AI Engineer passionate about building intelligent applications that solve real-world problems. I enjoy working across the entire development process, from crafting intuitive frontend experiences and designing scalable backend systems to integrating Generative AI, LLMs, RAG pipelines, and intelligent agents. What excites me most is turning complex ideas into practical products that are useful, reliable, and easy to work with",
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
  { value: 400, suffix: "+", label: "DSA problems · top 10%", source: "LeetCode" },
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
      title: "Omnichannel Conversational AI",
      detail:
        "Built intelligent conversational agents using LangChain, Langgraph and RAG, with product-search tools, intent scoring, automated and human-assisted replies, and seamless AI-to-human handoff.",
      track: "genai",
      impact: "−50% avg. handling time",
      stack: ["LangChain", "Qdrant", "Semantic search"],
    },
    {
      title: "Natural Language to SQL (NL2SQL)",
      detail:
        "Built an AI-powered reporting engine using LangChain and RAG, allowing businesses to retrieve CRM insights and generate dynamic reports simply by asking questions in natural language",
      track: "genai",
      impact: "−70% manual reporting",
      stack: ["LangChain", "RAG", "PostgreSQL"],
    },
    {
      title: "AI-Powered Excel Insights",
      detail:
        "Built an AI-powered spreadsheet analysis engine that understands natural-language questions, generates code to analyse uploaded data, and creates relevant visualisations.",
      track: "genai",
      impact: "−70% manual reporting",
      stack: ["LLM codegen", "Python", "Charts"],
    },
    {
      title: "Instagram automation",
      detail:
        "Integrated Meta Graph API with LangChain-powered bot flows to automate Instagram conversations, handle customer queries, and deliver contextual responses",
      track: "growth",
      impact: "+60% engagement",
      stack: ["Meta Graph API", "LangChain", "Node.js"],
    },
    {
      title: "Meta Ads and Conversion Tracking",
      detail:
        "Integrated Meta Marketing APIs to manage custom audiences, capture leads from messaging ads and instant forms, track offline conversions through CAPI, and analyse ROAS, daily performance, and attribution breakdowns.",
      track: "growth",
      stack: ["Meta Ads", "Conversion API", "Segmentation"],
    },
    {
      title: "Multi-tenant email builder",
      detail:
        "Developed a drag-and-drop email template builder on GrapeJS and AWS SES,allowing businesses to design, manage, and send email campaigns from a shared platform.",
      track: "platform",
      stack: ["GrapeJS", "AWS SES", "Multi-tenant"],
    },
    {
      title: "GenAI WhatsApp templates",
      detail:
        "Designed and Built an end-to-end WhatsApp template generation workflow integrating GenAI and Meta APIs, enabling merchants to generate contextual templates easily.",
      track: "genai",
      stack: ["GenAI", "Prompt engineering", "React"],
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
    id: "agents",
    code: "SYS-01",
    title: "Omnichannel AI Agents",
    tagline: "One brain across WhatsApp, Instagram and web.",
    description:
      "Built Intelligent AI agents that understands customer queries and handle conversations based on Knowledge base or product catalogue autonomously with seamless handoff to human agents.",
    stack: ["LangChain", "LangGraph", "RAG", "Semantic search", "Meta Graph API", "PostgreSQL", "PG Vector"],
    outcome: "50% lower handling time",
    context: "Zithara.AI · production",
  },
  {
    id: "nl2sql",
    code: "SYS-02",
    title: "NL2SQL Reporting Engine",
    tagline: "Ask questions. Get AI Driven insights from CRM.",
    description:
      "Built a natural-language reporting engine that understands database schemas and converts plain-English questions into SQL queries, delivering relevant reports without requiring users to write SQL.",
    stack: ["LangChain", "Langgraph", "RAG", "PostgreSQL", "Qdrant", "Node.js"],
    outcome: "70% less manual reporting",
    context: "Zithara.AI · production",
  },
  {
    id: "insights",
    code: "SYS-03",
    title: "Excel Insights Engine",
    tagline: "Turn spreadsheets into actionable insights.",
    description:
      "Developed an AI-powered tool that analyses uploaded spreadsheets, generates Python code from natural-language questions, and creates relevant charts and visualisations.",
    stack: ["Langchain", "Langgraph", "Python", "React"],
    outcome: "70% less manual reporting",
    context: "Zithara.AI · production",
  },
  {
    id: "shopping",
    code: "LAB-04",
    title: "Virtual Shopping Assistant",
    tagline: "Making product discovery more conversational.",
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
    tagline: "Using NLP to evaluate descriptive answers.",
    description:
      "Developed an NLP-based system that evaluates descriptive answers using text similarity and transformer models, exploring faster and more consistent automated assessment. The work was published as a research paper.",
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
    tagline: "Machine learning for smarter farming decisions",
    description:
      "Developed a machine-learning solution for soil prediction to help farmers make informed agricultural decisions. The project received a Special Mention at a regional hackathon.",
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
    label: "Frameworks & Development",
    icon: "layers",
    items: ["React", "Next.js", "Node.js", "Express", "REST APIs", "Django"],
  },
  {
    id: "data",
    label: "Data & Cloud",
    icon: "database",
    items: ["PostgreSQL", "MongoDB", "DynamoDB", "Qdrant", "Kafka", "AWS Lambda", "AWS SES", "AWS SQS", "Serverless"],
  },
  {
    id: "ops",
    label: "DevOps & Practices",
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
  { title: "LeetCode top 10% · 400+ problems", issuer: "Data structures & algorithms", kind: "rank", icon: "target" },
  { title: "Exceptional Oration Award", issuer: "Green Corps", kind: "award", icon: "mic" },
];

/** Pre-written answers for the "query the model" console in About. */
export const consolePrompts: { q: string; a: string }[] = [
  {
    q: "Why should we hire you?",
    a: "I combine full-stack engineering with practical AI to build solutions that solve real-world problems. At Zithara.AI, I've contributed to production systems across backend development, conversational AI, intelligent reporting, and messaging and marketing automation. I enjoy taking ownership of problems, designing effective solutions, and turning complex requirements into reliable, scalable products.",
  },
  {
    q: "What do you specialize in?",
    a: "I specialize in building scalable full-stack applications, backend systems, AI agents, and intelligent automation workflows. Using technologies like Node.js, Python, LangChain, and AWS, I build reliable systems that simplify complex business processes and deliver practical, user-friendly solutions.",
  },
  {
    q: "How do you approach teamwork?",
    a: "I value clear communication, collaboration, and taking ownership of my work. I enjoy sharing ideas, learning from teammates, and approaching challenges with an open mind. I'm adaptable, detail-oriented, and comfortable working across different stages of the development lifecycle.",
  },
  {
    q: "Are you open to new opportunities?",
    a: "Yes! I'm open to full-time opportunities across India in Full Stack Developer and AI Engineer roles. Based in Hyderabad and flexible to relocate. Feel free to reach me at: vivekganathe@gmail.com or connect with me on https://www.linkedin.com/in/vivekganathe/.",
  },
];

export type IconName =
  | "brain" | "code" | "layers" | "database" | "workflow" | "cloud" | "chart" | "paper"
  | "trophy" | "target" | "mic" | "mail" | "phone" | "pin" | "github" | "linkedin"
  | "leetcode" | "download" | "arrow" | "external" | "spark" | "command" | "copy" | "check"
  | "cap" | "bolt" | "chat" | "search" | "close" | "menu";
