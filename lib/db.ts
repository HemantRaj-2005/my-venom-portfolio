import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { generateMockStats } from "./mock-stats";

// Global type declaration for Prisma in Dev mode
declare global {
  var prisma: PrismaClient | undefined;
}

let prismaClient: PrismaClient | null = null;
let databaseAvailable = false;

if (process.env.DATABASE_URL) {
  try {
    if (process.env.NODE_ENV === "production") {
      prismaClient = new PrismaClient();
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient();
      }
      prismaClient = global.prisma;
    }
    databaseAvailable = true;
  } catch (err) {
    console.warn("Failed to initialize Prisma client. Using JSON fallback database.", err);
  }
}

// -------------------------------------------------------------
// LOCAL JSON FALLBACK IMPLEMENTATION
// -------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_DB_PATH = path.join(DATA_DIR, "local_db.json");

// Helper to generate custom hex IDs (MongoDB style)
const generateId = () => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
};

// Seed Mock Data
const mockProjects = [
  {
    id: "proj_1",
    title: "Venom Core AI",
    slug: "venom-core-ai",
    overview: "An advanced, self-healing code analyzer that utilizes custom large language models to refactor codebases and fix security vulnerabilities instantly under a cybernetic command terminal.",
    features: [
      "Real-time static code analysis & linting",
      "AI-driven automated refactoring suggestions",
      "Cybernetic console output styling",
      "CI/CD pipeline webhook integration"
    ],
    challenges: "Handling huge ASTs in real-time without blocking the main node process thread was solved using worker pools and custom buffer queues.",
    architecture: "Web-worker pools coupled with a Next.js Edge route dispatcher. Memory leaks were eliminated through garbage collection hooks.",
    techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Prisma", "WebWorkers"],
    schemaUrl: "Prisma -> MongoDB Schema: Project has many Features and Logs.",
    apiFlow: "POST /api/analyze -> Parse AST -> Send to WebWorker -> LLM Model -> Suggestion JSON.",
    deployment: "Deployed on Vercel with serverless functions and custom edge route caching.",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=60"
    ],
    demoVideo: "",
    liveUrl: "https://venom-core-ai.dev",
    githubUrl: "https://github.com/HemantRaj-2005/venom-core-ai",
    performance: 98,
    seoTitle: "Venom Core AI - Automated Code Refactoring & Security",
    seoDesc: "Analyze and refactor your TypeScript codebases with an aggressive symbiote-powered artificial intelligence engine.",
    createdAt: new Date("2026-01-15").toISOString(),
    updatedAt: new Date("2026-01-15").toISOString()
  },
  {
    id: "proj_2",
    title: "Symbiote SaaS Core",
    slug: "symbiote-saas-core",
    overview: "A premium, high-converting brutalist landing template with integrated NextAuth credentials/social logs, stripe payments, and dynamic usage charts.",
    features: [
      "Credentials & OAuth logins (Google, GitHub)",
      "Dynamic usage metrics tracker (graphs and counters)",
      "Modular landing sections with floating 3D tech icons",
      "Stripe customer portal integrations"
    ],
    challenges: "Securing webhook event signatures and handling rapid database write surges during test runs was mitigated through memory caching.",
    architecture: "Next.js App Router API endpoints communicating with MongoDB via Prisma, utilizing rate-limiting middlewares.",
    techStack: ["Next.js 16", "NextAuth.js", "MongoDB", "Stripe API", "Framer Motion", "Recharts"],
    schemaUrl: "User model mapped to Accounts, Sessions, Subscriptions, and Payment Logs.",
    apiFlow: "User logs in -> Receives session JWT -> Stripe subscription webhooks update database status -> Dashboard unlocked.",
    deployment: "Dockerized container deployed on AWS ECS behind an NGINX reverse proxy.",
    gallery: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
    ],
    demoVideo: "",
    liveUrl: "https://symbiote-saas.dev",
    githubUrl: "https://github.com/HemantRaj-2005/symbiote-saas",
    performance: 95,
    seoTitle: "Symbiote SaaS - Preconfigured Premium Starter Kit",
    seoDesc: "Fast-track your startup launch with NextAuth, MongoDB, Stripe, and rich brutalist analytics widgets pre-installed.",
    createdAt: new Date("2026-03-10").toISOString(),
    updatedAt: new Date("2026-03-10").toISOString()
  },
  {
    id: "proj_3",
    title: "Web3 Carnage Gas Tracker",
    slug: "web3-carnage",
    overview: "A decentralized dashboard for tracking real-time gas fees, contract gas optimizations, and token burns across multiple EVM-compatible blockchains.",
    features: [
      "Web3 wallet connection (MetaMask, WalletConnect)",
      "Real-time gas tracking graph overlays",
      "AI gas optimizer for solidity smart contracts",
      "Push notification alerts via Telegram bot"
    ],
    challenges: "Avoiding RPC node rate limits and styling high-frequency charts without lag or screen stutter.",
    architecture: "Ethers.js polling nodes, feeding a custom React state context. Recharts hooks throttle data points to maintain 60FPS.",
    techStack: ["React 19", "Ethers.js", "Web3Modal", "Tailwind CSS", "Recharts", "Framer Motion"],
    schemaUrl: "Visitor tracking and saved user alert settings stored in local file schemas.",
    apiFlow: "Connect wallet -> Fetch block header -> Compute gas average -> Trigger Telegram webhook if parameters match user bounds.",
    deployment: "Static build hosted on IPFS and accessible via Cloudflare Web3 Gateway.",
    gallery: [
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=60"
    ],
    demoVideo: "",
    liveUrl: "https://carnage-gas.eth.limo",
    githubUrl: "https://github.com/HemantRaj-2005/web3-carnage",
    performance: 97,
    seoTitle: "Web3 Carnage - High FPS EVM Gas Tracker & Optimizer",
    seoDesc: "Monitor and optimize smart contract gas costs dynamically in a fluid symbiote environment.",
    createdAt: new Date("2026-04-20").toISOString(),
    updatedAt: new Date("2026-04-20").toISOString()
  }
];

const mockProducts = [
  {
    id: "prod_1",
    title: "Symbiote Premium Landing UI Kit",
    description: "An ultra-premium, dark glassmorphism component collection containing custom custom cursors, fluid canvas background shaders, and 30+ responsive hero blocks.",
    price: 49.00,
    category: "UI Kit",
    githubUrl: "https://github.com/HemantRaj-2005/symbiote-ui",
    demoUrl: "https://symbiote-ui.dev",
    downloadUrl: "/downloads/symbiote-ui.zip",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    features: ["Vanilla Tailwind v4 support", "Framer Motion animations built-in", "Custom SVG fluid distortions", "Sound FX hook packs"],
    licensing: "Single Developer License (Commercial Use Allowed)",
    isFeatured: true,
    isApproved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod_2",
    title: "VenomGPT Chatbot Widget API",
    description: "Embed an AI Assistant chatbot into your website styled like a comic book speech bubble. Comes with next-route handlers and streaming markdown parser.",
    price: 29.00,
    category: "API",
    githubUrl: "https://github.com/HemantRaj-2005/venom-chatbot",
    demoUrl: "https://venom-chatbot.dev",
    downloadUrl: "/downloads/venom-chatbot.zip",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    features: ["Dynamic prompt loading", "Streaming API support", "Custom theme selectors", "Visitor logging hooks"],
    licensing: "Unlimited Commercial License",
    isFeatured: true,
    isApproved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockPosts = [
  {
    id: "post_1",
    title: "Unleashing WebGL Shaders: Building Organic Symbiote Mesh",
    slug: "unleashing-webgl-shaders-symbiote",
    content: `## Building Organic Venom Shaders in WebGL

Web animations are often restricted by CPU cycles. Moving layout assets in response to cursor moves using JavaScript looks laggy. To achieve a **premium 60FPS fluid look**, we must offload calculations directly to the GPU using **custom GLSL fragment and vertex shaders**.

### Noise-Based Mesh Deformation

The core of our symbiote sphere animation lies in the vertex shader. We deform a standard sphere by applying a 3D Simplex Noise function over its vertex normals, scaled by the current time elapsed:

\`\`\`glsl
// Vertex Shader
uniform float uTime;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vPosition;

// Simplex 3D noise implementation
float noise(vec3 p) {
  // mathematical noise interpolation
  return sin(p.x * 2.0 + uTime) * cos(p.y * 2.0 + uTime) * sin(p.z * 2.0);
}

void main() {
  vNormal = normal;
  vPosition = position;
  
  // Deform vertex along normal using noise
  float displacement = noise(position * 3.0) * 0.15;
  vec3 newPosition = position + normal * displacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
\`\`\`

By writing our 3D logic this way, the animation is handled entirely on the GPU. The CPU only passes the time and mouse coordinate uniforms on every frame rendering step. This ensures high FPS on mobile and low-tier desktops alike.`,
    summary: "A technical deep dive on writing custom WebGL vertex and fragment shaders to render a fluid, organic, noise-deformed symbiote sphere at 60FPS.",
    published: true,
    tags: ["WebGL", "Three.js", "GLSL", "React 19"],
    category: "UI/UX Engineering",
    readTime: 6,
    seoTitle: "WebGL Shaders Guide: Dynamic Organic Symbiotes",
    seoDesc: "Learn how to build noise-deformed 3D meshes in Three.js and custom GLSL vertex shaders.",
    createdAt: new Date("2026-05-20").toISOString(),
    updatedAt: new Date("2026-05-20").toISOString()
  },
  {
    id: "post_2",
    title: "Next.js 16 caching and unstable_instant navigations",
    slug: "nextjs-16-caching-instant-navs",
    content: `## Speeding Up Client Navigations in Next.js 16

In Next.js 16, client-side navigations can be optimized using the new dynamic prefetching configurations. By exporting \`unstable_instant = { prefetch: 'static' }\` from our routes, we enable Next.js compiler validation.

### Understanding the Static Shell

When prefetching is configured, Next.js compiles page layouts ahead of time:
1. Static components are cached.
2. Dynamic data fetches (like database queries) are wrapped in React \`<Suspense>\` blocks.
3. On link click, the cached shell displays instantly while dynamic content streams in.

\`\`\`tsx
export const unstable_instant = { prefetch: 'static' }

export default async function ProjectPage() {
  return (
    <Suspense fallback={<DrippingSymbioteLoader />}>
      <DynamicContent />
    </Suspense>
  )
}
\`\`\`

If a component tries to access cookies or headers without a surrounding Suspense boundary, validation fails at build time. This ensures you never ship a slow page load to production.`,
    summary: "Learn how to leverage Next.js 16 unstable_instant segment configurations to build instantaneous page loads with partial prefetching shells.",
    published: true,
    tags: ["Next.js", "Caching", "Performance", "React Server Components"],
    category: "Full Stack Development",
    readTime: 4,
    seoTitle: "Next.js 16 Instant Navigations and Caching Guide",
    seoDesc: "Configure partial prefetching and compile-time validation using unstable_instant in Next.js 16.",
    createdAt: new Date("2026-05-28").toISOString(),
    updatedAt: new Date("2026-05-28").toISOString()
  }
];

// In-Memory Database State
let localDbState: any = null;

function loadLocalDb() {
  if (localDbState) return localDbState;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, "utf8");
      localDbState = JSON.parse(data);
      return localDbState;
    } catch (e) {
      console.error("Error reading local db file, rewriting...", e);
    }
  }

  // Generate Admin hashed password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "symbiote_roar_2026", salt);

  localDbState = {
    users: [
      {
        id: generateId(),
        name: "Symbiote Admin",
        email: process.env.ADMIN_EMAIL || "admin@venom.dev",
        hashedPassword: hashedPassword,
        role: "ADMIN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    leads: [],
    callbackRequests: [],
    contactMessages: [],
    newsletterSubscribers: [],
    projects: mockProjects,
    products: mockProducts,
    posts: mockPosts,
    comments: [],
    visitorLogs: [],
    devProfiles: [
      {
        id: "dev-profile-default",
        github: "HemantRaj-2005",
        leetcode: "HemantRaj-2005",
        codeforces: "HemantRaj-2005",
        codechef: "hemant_2005",
        geeksforgeeks: "hemantraj2005",
        hackerrank: "hemant_2005",
        atcoder: "hemant_2005",
        hackerearth: "hemant_2005",
        statsCache: JSON.stringify(generateMockStats()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  saveLocalDb();
  return localDbState;
}

function saveLocalDb() {
  if (!localDbState) return;
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localDbState, null, 2), "utf8");
}

// -------------------------------------------------------------
// UNIFIED DB REPOSITORY WRAPPER
// -------------------------------------------------------------
// We replicate the exact Prisma API layout for seamless swapping.
class MockCollection<T extends { id?: string; createdAt?: string; updatedAt?: string; [key: string]: any }> {
  private collectionKey: string;

  constructor(key: string) {
    this.collectionKey = key;
  }

  private getData(): T[] {
    const db = loadLocalDb();
    return db[this.collectionKey] || [];
  }

  private writeData(data: T[]) {
    const db = loadLocalDb();
    db[this.collectionKey] = data;
    saveLocalDb();
  }

  async findMany(args?: { where?: any; orderBy?: any; take?: number; include?: any }) {
    let items = [...this.getData()];

    if (args?.where) {
      items = items.filter(item => {
        return Object.entries(args.where).every(([key, val]: [string, any]) => {
          if (val === undefined) return true;
          // Handle object arrays or basic string checks
          if (val && typeof val === "object") {
            if ("has" in val) {
              return Array.isArray(item[key]) && item[key].includes(val.has);
            }
            if ("equals" in val) {
              return item[key] === val.equals;
            }
          }
          return item[key] === val;
        });
      });
    }

    if (args?.orderBy) {
      const entry = Object.entries(args.orderBy)[0];
      if (entry) {
        const [field, order] = entry as [string, "asc" | "desc"];
        items.sort((a, b) => {
          const aVal = a[field] ?? "";
          const bVal = b[field] ?? "";
          if (aVal < bVal) return order === "asc" ? -1 : 1;
          if (aVal > bVal) return order === "asc" ? 1 : -1;
          return 0;
        });
      }
    }

    if (args?.take !== undefined) {
      items = items.slice(0, args.take);
    }

    // Polyfill simple ratings mapping inside Product
    if (this.collectionKey === "products" && args?.include?.ratings) {
      const db = loadLocalDb();
      const ratings = db.ratings || [];
      items = items.map(item => ({
        ...item,
        ratings: ratings.filter((r: any) => r.productId === item.id)
      }));
    }

    return items;
  }

  async findUnique(args: { where: any; include?: any }) {
    const items = this.getData();
    const found = items.find(item => {
      return Object.entries(args.where).every(([key, val]) => item[key] === val);
    });

    if (found && this.collectionKey === "products" && args?.include?.ratings) {
      const db = loadLocalDb();
      const ratings = db.ratings || [];
      return {
        ...found,
        ratings: ratings.filter((r: any) => r.productId === found.id)
      };
    }
    return found || null;
  }

  async findFirst(args?: { where: any }) {
    const items = this.getData();
    if (!args?.where) return items[0] || null;
    const found = items.find(item => {
      return Object.entries(args.where).every(([key, val]) => item[key] === val);
    });
    return found || null;
  }

  async create(args: { data: any }) {
    const items = this.getData();
    const newItem = {
      id: generateId(),
      ...args.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.writeData(items);
    return newItem;
  }

  async update(args: { where: any; data: any }) {
    const items = this.getData();
    const index = items.findIndex(item => {
      return Object.entries(args.where).every(([key, val]) => item[key] === val);
    });

    if (index === -1) {
      throw new Error(`Record to update not found.`);
    }

    const updatedItem = {
      ...items[index],
      ...args.data,
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    this.writeData(items);
    return updatedItem;
  }

  async delete(args: { where: any }) {
    const items = this.getData();
    const index = items.findIndex(item => {
      return Object.entries(args.where).every(([key, val]) => item[key] === val);
    });

    if (index === -1) {
      throw new Error(`Record to delete not found.`);
    }

    const deletedItem = items[index];
    items.splice(index, 1);
    this.writeData(items);
    return deletedItem;
  }

  async count(args?: { where?: any }) {
    const items = await this.findMany(args);
    return items.length;
  }
}

// Check database credentials fallback logic
export async function isDbConnected(): Promise<boolean> {
  if (!databaseAvailable || !prismaClient) return false;
  try {
    // Attempt connection check (pinging db or fetching first user)
    await prismaClient.user.findFirst();
    return true;
  } catch (e) {
    console.warn("MongoDB connection failed, falling back to local storage.", e);
    return false;
  }
}

// Helper to determine if we should execute Prisma or Mock DB
const getDbEngine = () => {
  if (databaseAvailable && prismaClient) {
    return {
      user: prismaClient.user,
      lead: prismaClient.lead,
      product: prismaClient.product,
      rating: prismaClient.rating,
      project: prismaClient.project,
      post: prismaClient.post,
      comment: prismaClient.comment,
      visitorLog: prismaClient.visitorLog,
      callbackRequest: prismaClient.callbackRequest,
      contactMessage: prismaClient.contactMessage,
      newsletterSubscriber: prismaClient.newsletterSubscriber,
      devProfile: (prismaClient as any).devProfile,
      isPrisma: true
    };
  }

  // Preload local database mock states
  loadLocalDb();

  return {
    user: new MockCollection("users"),
    lead: new MockCollection("leads"),
    product: new MockCollection("products"),
    rating: new MockCollection("ratings"),
    project: new MockCollection("projects"),
    post: new MockCollection("posts"),
    comment: new MockCollection("comments"),
    visitorLog: new MockCollection("visitorLogs"),
    callbackRequest: new MockCollection("callbackRequests"),
    contactMessage: new MockCollection("contactMessages"),
    newsletterSubscriber: new MockCollection("newsletterSubscribers"),
    devProfile: new MockCollection("devProfiles"),
    isPrisma: false
  };
};

export const db = getDbEngine();
