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

export type Metric = { value: string; label: string; source: string };

/** Recruiter-facing highlights shown in the hero: outcomes first. */
export const metrics: Metric[] = [
  { value: "4+", label: "AI systems shipped", source: "AI agents · NL2SQL · Excel insights" },
  { value: "−70%", label: "less manual reporting", source: "NL2SQL reporting engine" },
  { value: "−50%", label: "lower handling time", source: "Conversational AI agents" },
  { value: "400+", label: "DSA problems solved", source: "LeetCode · top 10%" },
];

export type Highlight = { title: string; text: string; impact?: string; stack: string[] };

export type Role = {
  title: string;
  type: "Full-time" | "Internship";
  start: string;
  /** Omitted for the current role. */
  end?: string;
  period: string;
  focus: string;
  highlights: Highlight[];
};

export const experience = {
  company: "Zithara.AI",
  location: "Hyderabad",
  context: "AI-first CRM platform for retail brands",
  /** First day at the company (internship start). */
  start: "2025-05-01",
  period: "May 2025 — Present",
  /** Current role, used in short intros. */
  role: "Software Development Engineer",
  roles: [
    {
      title: "Software Development Engineer",
      type: "Full-time",
      start: "2025-08-01",
      period: "Aug 2025 — Present",
      focus: "Conversational AI, AI-powered CRM features, Meta integrations and backend engineering.",
      highlights: [
        {
          title: "Conversational AI agents",
          text: "Built production AI agents with LangChain, RAG and semantic search that give context-aware replies and hand off smoothly to a human. They run in Shadow Mode, suggesting replies to support agents, or Live Mode, answering customers directly.",
          impact: "−50% handling time",
          stack: ["LangChain", "LangGraph", "RAG", "Qdrant"],
        },
        {
          title: "NL2SQL reporting engine",
          text: "Built a reporting engine that turns plain-English questions into SQL, so businesses can pull CRM reports without writing a single query.",
          impact: "−70% manual reporting",
          stack: ["LangChain", "RAG", "PostgreSQL"],
        },
        {
          title: "AI Excel insights",
          text: "Created an engine that reads uploaded spreadsheets, writes analysis code from a natural-language question and returns the right charts.",
          stack: ["Python", "LLM codegen", "Charts"],
        },
        {
          title: "Meta Ads integration",
          text: "Integrated Meta Ads end to end — campaign data, ad creatives, custom audiences built from segments, offline conversion tracking through the Conversions API, and performance reporting.",
          stack: ["Meta Marketing API", "Conversions API"],
        },
        {
          title: "Multi-tenant email builder",
          text: "Developed a drag-and-drop email template builder on GrapeJS and AWS SES that lets every business on the platform design and send its own campaigns.",
          stack: ["GrapeJS", "AWS SES", "React"],
        },
        {
          title: "Bulk data import",
          text: "Reworked CRM import and processing pipelines to remove bottlenecks, so large customer datasets load reliably and much faster.",
          stack: ["Node.js", "PostgreSQL"],
        },
      ],
    },
    {
      title: "Full Stack Developer Intern",
      type: "Internship",
      start: "2025-05-01",
      end: "2025-08-01",
      period: "May 2025 — Aug 2025",
      focus: "Meta messaging automation and GenAI-powered bot flows.",
      highlights: [
        {
          title: "Instagram automation",
          text: "Built Instagram automation on the Meta Graph API — automated replies, quick replies and interactive messages that keep customers engaged.",
          impact: "+60% engagement",
          stack: ["Meta Graph API", "Node.js"],
        },
        {
          title: "AI bot-flow generation",
          text: "Used LangGraph to generate conversational bot flows automatically from a business's requirements, replacing hand-built flows.",
          stack: ["LangGraph", "LangChain"],
        },
        {
          title: "GenAI WhatsApp templates",
          text: "Integrated Meta APIs for WhatsApp template creation and used GenAI to write context-rich templates for automated customer messages.",
          stack: ["Meta APIs", "GenAI", "Prompt engineering"],
        },
      ],
    },
  ] satisfies Role[],
};

export type ProjectKind = "nl2sql" | "agents" | "metaads" | "shopping" | "exam" | "agri";

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
    id: "metaads",
    code: "SYS-03",
    title: "Meta Ads & Conversion Tracking",
    tagline: "Connecting ad spend to real sales.",
    description:
      "Integrated Meta's marketing APIs into the CRM: synced campaign data and ad creatives, built custom audiences from customer segments, captured leads from messaging ads and instant forms, and sent offline sales back through the Conversions API — so businesses can see ROAS, daily performance and attribution in one place.",
    stack: ["Meta Marketing API", "Conversions API", "Custom Audiences", "Lead Ads"],
    outcome: "Offline sales tracked to ads",
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

export type Credential = {
  title: string;
  issuer: string;
  kind: "cert" | "award" | "paper" | "rank";
  icon: IconName;
  /** Public verification link, opened in a new tab. */
  href?: string;
};

export const credentials: Credential[] = [
  {
    title: "Generative AI Fundamentals",
    issuer: "Databricks Academy · Accreditation",
    kind: "cert",
    icon: "spark",
    href: "https://credentials.databricks.com/8d061a35-dbb6-4a61-8f6b-fd768520bcfa",
  },
  {
    title: "Prompt Design in Vertex AI",
    issuer: "Google Cloud · Skill badge",
    kind: "cert",
    icon: "brain",
    href: "https://www.credly.com/badges/169da488-0a91-418d-9e06-4467042dbdd7",
  },
  {
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services · Coursera",
    kind: "cert",
    icon: "cloud",
    href: "https://www.coursera.org/account/accomplishments/verify/FFKH27X18LFN",
  },
  {
    title: "Google Data Analytics Certificate",
    issuer: "Google · Coursera",
    kind: "cert",
    icon: "chart",
    href: "https://www.coursera.org/account/accomplishments/specialization/certificate/3VHAL5UFQP67",
  },
  {
    title: "Foundations of Cybersecurity",
    issuer: "Google · Coursera",
    kind: "cert",
    icon: "shield",
    href: "https://www.coursera.org/account/accomplishments/verify/KFCDCP4NJAPZ",
  },
  {
    title: "Web Development Fundamentals",
    issuer: "IBM SkillsBuild",
    kind: "cert",
    icon: "code",
    href: "https://www.credly.com/badges/872bb6ce-5657-4690-8623-0dfc2d8aa908",
  },
  { title: "Research paper — automated exam evaluation", issuer: "Published · NLP", kind: "paper", icon: "paper" },
  { title: "Special Mention, regional hackathon", issuer: "AI for agriculture", kind: "award", icon: "trophy" },
  { title: "LeetCode top 10% · 400+ problems", issuer: "Data structures & algorithms", kind: "rank", icon: "target", href: profile.links.leetcode },
  { title: "Exceptional Oration Award", issuer: "Green Corps", kind: "award", icon: "mic" },
];

/** Pre-written answers for the "query the model" console in About. */
/**
 * Lines shown between sections; two are picked at random on each visit.
 * Wrap words in *asterisks* to highlight them. Keep each under ~90 characters so it fits in two lines.
 */
export const quotes: string[] = [
  "Innovation starts with *curiosity* and thrives through *persistence*.",
  "The best AI isn't the one people notice — it's the one that quietly makes their work *easier*.",
  "Intelligence is not in what we build, but in what it makes *possible*.",
  "AI should *amplify* human potential, not complicate it.",
  "Behind every intelligent experience is *thoughtful engineering*.",
  "I believe the most interesting things happen where *logic* meets *imagination*.",
  "Think beyond what's possible. *Build beyond what's expected.*",
];

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
  | "cap" | "bolt" | "chat" | "search" | "close" | "menu" | "shield";
