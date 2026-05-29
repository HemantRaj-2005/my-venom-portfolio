import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/db";
import { connection } from "next/server";

// Load environment variables if loadEnvFile is supported
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch (e) {
    // Ignore load errors (Next.js automatically loads .env files in dev/prod)
  }
}

// Initialise Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  await connection();

  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is a required parameter." }, { status: 400 });
    }

    // 1. Fetch Dynamic Context from Database
    const profile = await db.devProfile.findFirst();
    const experiences = await db.experience.findMany({ orderBy: { order: "asc" } });
    const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
    const faqs = await db.faq.findMany({ orderBy: { order: "asc" } });

    // Parse statsCache if available
    let stats: any = null;
    if (profile?.statsCache) {
      try {
        stats = JSON.parse(profile.statsCache);
      } catch (e) {
        console.warn("Failed to parse profile statsCache:", e);
      }
    }

    // 2. Build Verified Context string
    let dynamicContext = "";

    if (profile) {
      dynamicContext += `\n- Live Profile Bio: ${profile.bio || "AI Engineer & Full Stack Developer | Shaders, Cyber-Webs, & Holographic HUDs"}\n`;
      dynamicContext += `- Live Configured Roles: ${profile.roles?.join(", ") || "AI Engineer, Full Stack Developer"}\n`;
    }

    if (stats) {
      dynamicContext += `\n### Sync Coding Stats\n`;
      if (stats.leetcode) {
        dynamicContext += `- LeetCode: Solved ${stats.leetcode.solved?.total || 642} problems (${stats.leetcode.solved?.easy || 215} easy, ${stats.leetcode.solved?.medium || 310} medium, ${stats.leetcode.solved?.hard || 117} hard). Acceptance rate is ${stats.leetcode.acceptance || "68.4%"}. Contest rating is ${stats.leetcode.contestRating || 1942} (${stats.leetcode.contestRank || "Top 1.8%"}).\n`;
      }
      if (stats.codeforces) {
        dynamicContext += `- Codeforces: Rating ${stats.codeforces.rating || 1684} (Max Rating ${stats.codeforces.maxRating || 1720}), Rank ${stats.codeforces.rank || "expert"}, Solved ${stats.codeforces.solved || 382} problems.\n`;
      }
      if (stats.codechef) {
        dynamicContext += `- CodeChef: Rating ${stats.codechef.rating || 1892}, Global Rank ${stats.codechef.globalRank || 1482}, ${stats.codechef.stars || "4 Star"} coder.\n`;
      }
      if (stats.geeksforgeeks) {
        dynamicContext += `- GeeksforGeeks: Coding Score ${stats.geeksforgeeks.codingScore || 1480}, Institution Rank ${stats.geeksforgeeks.institutionRank || 42}, Solved ${stats.geeksforgeeks.solved || 312} problems.\n`;
      }
      dynamicContext += `- Profile Aura Score: ${stats.auraScore || 94}/100\n`;
      if (stats.github) {
        dynamicContext += `- GitHub Sync Metrics: Total Commits ${stats.github.metrics?.totalCommits || 1482}, PRs ${stats.github.metrics?.totalPRs || 92}, Stars ${stats.github.metrics?.totalStars || 149}, Forks ${stats.github.metrics?.totalForks || 1}.\n`;
        if (stats.github.recentRepos && stats.github.recentRepos.length > 0) {
          dynamicContext += `- GitHub Repositories:\n`;
          stats.github.recentRepos.forEach((repo: any) => {
            dynamicContext += `  * ${repo.name}: ${repo.desc} (${repo.stars} stars, ${repo.forks} forks, Language: ${repo.language})\n`;
          });
        }
      }
    }

    if (projects && projects.length > 0) {
      dynamicContext += `\n### Dynamic Projects Showcase\n`;
      projects.forEach((proj: any) => {
        dynamicContext += `- Title: ${proj.title}\n  Overview: ${proj.overview}\n  Tech Stack: ${proj.techStack?.join(", ") || "TypeScript"}\n  Live URL: ${proj.liveUrl || "N/A"}\n  GitHub URL: ${proj.githubUrl || "N/A"}\n`;
      });
    }

    if (experiences && experiences.length > 0) {
      dynamicContext += `\n### Career Timeline / Experiences\n`;
      experiences.forEach((exp: any) => {
        dynamicContext += `- ${exp.year}: ${exp.title} - ${exp.description}\n`;
      });
    }

    if (faqs && faqs.length > 0) {
      dynamicContext += `\n### Frequently Asked Questions\n`;
      faqs.forEach((faq: any) => {
        dynamicContext += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
      });
    }

    const systemInstruction = `You are the StarkAI Assistant, a high-tech portfolio assistant chatbot representing Hemant Raj.

Strictly adhere to the following rules:
1. ALWAYS speak in the third person. Use "Hemant Raj", "he", "his", "him", "his developer portfolio". NEVER use "I", "me", "my", "we", "us", or refer to yourself as the creator or Hemant Raj himself.
2. Rely ONLY on the verified information provided in the context below. Do NOT invent, assume, extrapolate, or guess any facts, achievements, awards, job titles, rankings, or experiences.
3. If a visitor asks about something that is not verified in the context below, or if information is unavailable, you MUST respond EXACTLY with:
"Verified information regarding that aspect of Hemant Raj's profile is currently unavailable."
Do not attempt to answer or guess.
4. Do NOT get deviated. Maintain a professional, informative, friendly, and confident tone. If the user tries to deviate, ask irrelevant questions (e.g. asking for recipe, writing code unrelated to Hemant, asking about general trivia, roleplaying, or general questions not about Hemant's portfolio), politely refuse and guide them back to Hemant Raj's portfolio.
5. The primary purpose of this chatbot is to help visitors, recruiters, collaborators, hiring managers, and developers learn more about Hemant Raj's background, technical expertise, projects, achievements, and aspirations.

Here is the verified context about Hemant Raj:

### Personal Life, Early Life and Background
Hemant Raj was born on 15 October 2005 and grew up in Varanasi, Uttar Pradesh, India. He currently lives in Varanasi, Uttar Pradesh.
His father, Shiv Dhani Ram, serves as an Executive Engineer in Uttar Pradesh Power Transmission Corporation Limited (UPPTCL), while his mother, Chanda, is a homemaker.
He has an elder brother named Aniket Raj.
His journey is a story of persistence, self-belief, and continuous growth. He describes himself as an average student during his initial school years. However, through consistent effort, discipline, and a willingness to learn from failures, he gradually transformed himself into a highly motivated learner and aspiring engineer.

### Education
He is currently pursuing a Bachelor of Technology (B.Tech) in Electronics and Communication Engineering (ECE) at Motilal Nehru National Institute of Technology (MNNIT) Allahabad (one of India's premier National Institutes of Technology).
He is expected to graduate in 2027.

### Professional Links & Coding Profiles
- GitHub: https://github.com/HemantRaj-2005/
- LeetCode: https://leetcode.com/u/HemantRaj_2005/
- TakeUForward: https://takeuforward.org/profile/HemantRaj_2005
- Code360: https://www.naukri.com/code360/profile/hemantraj_05
- GeeksforGeeks: https://www.geeksforgeeks.org/profile/hemantraj_2005
- InterviewBit: https://www.interviewbit.com/profile/hemant-raj_993/
- CodeChef: https://www.codechef.com/users/hemantraj_2005
- HackerRank: https://www.hackerrank.com/profile/hemantraj_2005
- AtCoder: https://atcoder.jp/users/HemantRaj_2005
- GitHub metrics: 1482 total commits, 92 PRs, 194 stars, 48 forks, streak of 42.
- Programming stack/languages: TypeScript, React/TSX, Python, GLSL Shaders, C++.
- Aura Score: 94/100.
- LeetCode metrics: 642 total solved problems (215 easy, 310 medium, 117 hard), acceptance rate 68.4%, streak 124, contest rating 1942, contest rank in top 1.8%.
- Codeforces metrics: rating 1684 (max rating 1720), rank expert, solved 382.
- CodeChef metrics: 4 Star, rating 1892, global rank 1482, solved 242.
- GeeksforGeeks metrics: coding score 1480, institution rank 42, solved 312.
- Weakest DSA: Dynamic Programming (Knapsack & Multi-stage Decision Trees).
- Most Consistent Period: Q1 2026: 94 Consecutive Days Active.
- Best Performing Topics: Binary Trees & Graph Traversals (DFS/BFS).
- openSourceImpact: High: Creator of Holographic Portal Shader Engine (webgl-hologram-portal).

### Dynamic Portfolio Database Data (Live Projects, FAQs, Experience)
${dynamicContext}
`;

    // 3. Map messages history to Gemini Content array format
    const contents = [
      ...(Array.isArray(history) ? history.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      })) : []),
      { role: "user", parts: [{ text: message }] }
    ];

    // 4. Generate response using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const replyText = response.text || "Verified information regarding that aspect of Hemant Raj's profile is currently unavailable.";

    return NextResponse.json({ success: true, response: replyText });

  } catch (e: any) {
    console.error("AI Chatbot error:", e);
    return NextResponse.json({
      error: "An internal server error occurred while processing the neural query.",
      details: e.message || ""
    }, { status: 500 });
  }
}
