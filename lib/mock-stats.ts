// Types for coding analytics
export interface GitHubStats {
  profile: {
    name: string;
    avatarUrl: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    publicRepos: number;
  };
  metrics: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalStars: number;
    totalForks: number;
    streak: number;
  };
  languages: { name: string; percent: number; color: string }[];
  heatmap: { date: string; count: number }[];
  recentRepos: { name: string; desc: string; stars: number; forks: number; language: string; url: string }[];
  growth: { month: string; repos: number; stars: number }[];
}

export interface LeetCodeStats {
  solved: { total: number; easy: number; medium: number; hard: number };
  acceptance: string;
  streak: number;
  contestRating: number;
  contestRank: string;
  contestHistory: { name: string; rating: number; rank: number }[];
  topicSolve: { name: string; solved: number; total: number }[];
}

export interface CodeforcesStats {
  rating: number;
  maxRating: number;
  rank: string;
  solved: number;
  history: { contest: string; rating: number; rank: number }[];
  tags: { name: string; count: number }[];
}

export interface CodeChefStats {
  stars: string;
  rating: number;
  globalRank: number;
  solved: number;
}

export interface GfGStats {
  codingScore: number;
  institutionRank: number;
  solved: number;
}

export interface DevStatsPayload {
  github: GitHubStats;
  leetcode: LeetCodeStats;
  codeforces: CodeforcesStats;
  codechef: CodeChefStats;
  geeksforgeeks: GfGStats;
  auraScore: number;
  weakestDSA: string;
  mostConsistentPeriod: string;
  bestPerformingTopics: string;
  githubProductivity: string;
  interviewReadiness: string;
  openSourceImpact: string;
  weeklyReport: string;
  skills: { subject: string; value: number }[];
  lastSynced: string;
}

// Generate complete premium mock statistics matching the user
export function generateMockStats(
  githubUser = "HemantRaj-2005",
  leetcodeUser = "HemantRaj-2005",
  codeforcesUser = "HemantRaj-2005",
  codechefUser = "hemant_2005",
  gfgUser = "hemantraj2005"
): DevStatsPayload {
  const now = new Date();
  
  // 1. Generate GitHub contribution heatmap
  const heatmap: { date: string; count: number }[] = [];
  for (let i = 365; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    // Random contributions with patterns (more on weekdays)
    const day = d.getDay();
    const isWeekend = day === 0 || day === 6;
    const rand = Math.random();
    let count = 0;
    if (rand > 0.4) {
      count = isWeekend ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 9) + 1;
    }
    heatmap.push({ date: dateStr, count });
  }

  return {
    github: {
      profile: {
        name: "Hemant Raj",
        avatarUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=60",
        bio: "AI Engineer & Full Stack Developer | Shaders, Symbiotes, & Cybernetics",
        location: "Delhi, India",
        followers: 124,
        following: 56,
        publicRepos: 32,
      },
      metrics: {
        totalCommits: 1482,
        totalPRs: 92,
        totalIssues: 24,
        totalStars: 194,
        totalForks: 48,
        streak: 42,
      },
      languages: [
        { name: "TypeScript", percent: 45, color: "#3178c6" },
        { name: "React / TSX", percent: 25, color: "#61dafb" },
        { name: "Python", percent: 15, color: "#3572A5" },
        { name: "GLSL Shaders", percent: 10, color: "#563d7c" },
        { name: "C++", percent: 5, color: "#f34b7d" },
      ],
      heatmap,
      recentRepos: [
        { name: "venom-portfolio", desc: "AAA cinematic dark theme symbiote-inspired developer portfolio.", stars: 45, forks: 12, language: "TypeScript", url: `https://github.com/${githubUser}/venom-portfolio` },
        { name: "ai-code-analyzer", desc: "A self-healing code reviewer powered by Large Language Models.", stars: 32, forks: 8, language: "TypeScript", url: `https://github.com/${githubUser}/ai-code-analyzer` },
        { name: "webgl-morph-core", desc: "Custom noise-deformed WebGL liquid metal sphere core engine.", stars: 28, forks: 4, language: "GLSL", url: `https://github.com/${githubUser}/webgl-morph-core` },
        { name: "saas-stripe-boil", desc: "Preconfigured full-stack SaaS boilerplate with user profiles & webhooks.", stars: 24, forks: 7, language: "TypeScript", url: `https://github.com/${githubUser}/saas-stripe-boil` },
      ],
      growth: [
        { month: "Jan", repos: 22, stars: 110 },
        { month: "Feb", repos: 24, stars: 128 },
        { month: "Mar", repos: 27, stars: 145 },
        { month: "Apr", repos: 29, stars: 168 },
        { month: "May", repos: 32, stars: 194 },
      ],
    },
    leetcode: {
      solved: { total: 642, easy: 215, medium: 310, hard: 117 },
      acceptance: "68.4%",
      streak: 124,
      contestRating: 1942,
      contestRank: "Top 1.8%",
      contestHistory: [
        { name: "Weekly 382", rating: 1845, rank: 1420 },
        { name: "Weekly 383", rating: 1878, rank: 980 },
        { name: "Weekly 384", rating: 1912, rank: 740 },
        { name: "Biweekly 121", rating: 1930, rank: 1100 },
        { name: "Weekly 385", rating: 1942, rank: 520 },
      ],
      topicSolve: [
        { name: "Dynamic Programming", solved: 64, total: 120 },
        { name: "Arrays & Strings", solved: 145, total: 180 },
        { name: "Trees & Graphs", solved: 82, total: 110 },
        { name: "Sorting & Search", solved: 76, total: 90 },
        { name: "Greedy Algorithms", solved: 34, total: 50 },
        { name: "Math & Bit Manipulation", solved: 48, total: 80 },
      ],
    },
    codeforces: {
      rating: 1684,
      maxRating: 1720,
      rank: "expert",
      solved: 382,
      history: [
        { contest: "Round 912 (Div 2)", rating: 1542, rank: 2450 },
        { contest: "Round 915 (Div 2)", rating: 1588, rank: 1820 },
        { contest: "Round 920 (Div 3)", rating: 1645, rank: 450 },
        { contest: "Round 922 (Div 2)", rating: 1684, rank: 1200 },
      ],
      tags: [
        { name: "implementation", count: 124 },
        { name: "math", count: 82 },
        { name: "greedy", count: 74 },
        { name: "dp", count: 54 },
        { name: "graphs", count: 32 },
        { name: "data structures", count: 42 },
      ],
    },
    codechef: {
      stars: "4 Star",
      rating: 1892,
      globalRank: 1482,
      solved: 242,
    },
    geeksforgeeks: {
      codingScore: 1480,
      institutionRank: 42,
      solved: 312,
    },
    auraScore: 94,
    weakestDSA: "Dynamic Programming: Knapsack & Multi-stage Decision Trees",
    mostConsistentPeriod: "Q1 2026: 94 Consecutive Days Active",
    bestPerformingTopics: "Binary Trees & Graph Traversals (DFS/BFS)",
    githubProductivity: "92%",
    interviewReadiness: "95%",
    openSourceImpact: "High: Creator of Symbiote Core Shader Engine",
    weeklyReport: "Admin logged 34 GitHub commits across 4 active repositories, solving 9 Medium/Hard LeetCode problems. Focus lay heavily on WebGL shader logic and local JSON DB transactional wrapper safety checks.",
    skills: [
      { subject: "Dynamic Programming", value: 85 },
      { subject: "Arrays & Strings", value: 98 },
      { subject: "Trees & Graphs", value: 92 },
      { subject: "System Design", value: 88 },
      { subject: "Greedy Algorithms", value: 80 },
      { subject: "Mathematics", value: 84 },
    ],
    lastSynced: now.toLocaleString(),
  };
}
