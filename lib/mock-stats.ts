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

// Generate zeroed statistics instead of preseeded artificial data
export function generateMockStats(
  githubUser = "",
  leetcodeUser = "",
  codeforcesUser = "",
  codechefUser = "",
  gfgUser = ""
): DevStatsPayload {
  const now = new Date();
  
  // Create an empty heatmap for the last 365 days (strictly 0 commits)
  const heatmap: { date: string; count: number }[] = [];
  for (let i = 365; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    heatmap.push({ date: dateStr, count: 0 });
  }

  return {
    github: {
      profile: {
        name: githubUser || "Not Synced",
        avatarUrl: "",
        bio: "Profile not synchronized yet.",
        location: "",
        followers: 0,
        following: 0,
        publicRepos: 0,
      },
      metrics: {
        totalCommits: 0,
        totalPRs: 0,
        totalIssues: 0,
        totalStars: 0,
        totalForks: 0,
        streak: 0,
      },
      languages: [],
      heatmap,
      recentRepos: [],
      growth: [],
    },
    leetcode: {
      solved: { total: 0, easy: 0, medium: 0, hard: 0 },
      acceptance: "0%",
      streak: 0,
      contestRating: 0,
      contestRank: "N/A",
      contestHistory: [],
      topicSolve: [],
    },
    codeforces: {
      rating: 0,
      maxRating: 0,
      rank: "N/A",
      solved: 0,
      history: [],
      tags: [],
    },
    codechef: {
      stars: "N/A",
      rating: 0,
      globalRank: 0,
      solved: 0,
    },
    geeksforgeeks: {
      codingScore: 0,
      institutionRank: 0,
      solved: 0,
    },
    auraScore: 0,
    weakestDSA: "N/A",
    mostConsistentPeriod: "N/A",
    bestPerformingTopics: "N/A",
    githubProductivity: "0%",
    interviewReadiness: "0%",
    openSourceImpact: "N/A",
    weeklyReport: "No synchronized data available.",
    skills: [],
    lastSynced: "Never",
  };
}
