function cleanText(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function matchRegex(str: string, regex: RegExp, index = 1): string | null {
  const match = str.match(regex);
  return match && match[index] ? match[index] : null;
}

function parseNumber(value: string | null | undefined): number {
  if (!value) return 0;
  return parseInt(value.replace(/,/g, ""), 10) || 0;
}

function parseNumberFromRegex(str: string, regex: RegExp): number {
  return parseNumber(matchRegex(str, regex));
}

function matchAnyNumber(str: string, regexes: RegExp[]): number {
  for (const regex of regexes) {
    const value = parseNumberFromRegex(str, regex);
    if (value > 0) return value;
  }
  return 0;
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "User-Agent": "Venom-Analytics/1.0",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

function calculateStreak(heatmap: { date: string; count: number }[]): number {
  let streak = 0;
  const sorted = [...heatmap].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > 0) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function countActiveDays(heatmap: { date: string; count: number }[]): number {
  return heatmap.filter((d) => d.count > 0).length;
}

function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    C: "#555555",
    "C++": "#f34b7d",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Rust: "#dea584",
    Go: "#00ADD8",
  };
  return colors[lang] || "#888888";
}

export async function scrapeGithub(username: string) {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: githubHeaders(),
    });
    if (!userRes.ok) throw new Error("GitHub profile fetch failed");
    const userData = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: githubHeaders() }
    );
    const reposData = reposRes.ok ? await reposRes.json() : [];

    let stars = 0;
    let forks = 0;
    let privateRepos = 0;
    let archivedRepos = 0;
    let forkedRepos = 0;
    const languagesMap: Record<string, number> = {};
    const recentRepos: {
      name: string;
      desc: string;
      stars: number;
      forks: number;
      language: string;
      url: string;
    }[] = [];

    if (Array.isArray(reposData)) {
      reposData.forEach((repo: {
        stargazers_count?: number;
        forks_count?: number;
        language?: string;
        private?: boolean;
        archived?: boolean;
        fork?: boolean;
        name?: string;
        description?: string;
        html_url?: string;
        created_at?: string;
      }) => {
        stars += repo.stargazers_count || 0;
        forks += repo.forks_count || 0;
        if (repo.private) privateRepos++;
        if (repo.archived) archivedRepos++;
        if (repo.fork) forkedRepos++;
        if (repo.language) {
          languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
        }
      });

      reposData
        .sort(
          (a: { stargazers_count?: number }, b: { stargazers_count?: number }) =>
            (b.stargazers_count || 0) - (a.stargazers_count || 0)
        )
        .slice(0, 5)
        .forEach((repo: {
          name?: string;
          description?: string;
          stargazers_count?: number;
          forks_count?: number;
          language?: string;
          html_url?: string;
        }) => {
          recentRepos.push({
            name: repo.name || "",
            desc: repo.description || "",
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            language: repo.language || "",
            url: repo.html_url || "",
          });
        });
    }

    const totalRepos = Object.values(languagesMap).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languagesMap)
      .map(([name, count]) => ({
        name,
        percent: totalRepos > 0 ? Math.round((count / totalRepos) * 100) : 0,
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.percent - a.percent);

    let heatmap: { date: string; count: number }[] = [];
    try {
      const contribRes = await fetch(`https://github.com/users/${username}/contributions`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (contribRes.ok) {
        const html = await contribRes.text();
        const matches = [
          ...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g),
        ];
        if (matches.length > 0) {
          heatmap = matches.map((m) => ({
            date: m[1],
            count: parseInt(m[2], 10),
          }));
        }
      }
    } catch {
      /* heatmap stays empty */
    }

    let totalPRs = 0;
    let totalIssues = 0;
    try {
      const prRes = await fetch(
        `https://api.github.com/search/issues?q=author:${username}+type:pr+is:merged&per_page=1`,
        { headers: githubHeaders() }
      );
      if (prRes.ok) {
        const prData = await prRes.json();
        totalPRs = prData.total_count || 0;
      }
      const issueRes = await fetch(
        `https://api.github.com/search/issues?q=author:${username}+type:issue&per_page=1`,
        { headers: githubHeaders() }
      );
      if (issueRes.ok) {
        const issueData = await issueRes.json();
        totalIssues = issueData.total_count || 0;
      }
    } catch {
      /* PR/issue counts stay 0 */
    }

    const growth: { month: string; repos: number; stars: number }[] = [];
    if (Array.isArray(reposData) && reposData.length > 0) {
      const monthMap: Record<string, { repos: number; stars: number }> = {};
      reposData.forEach((repo: { created_at?: string; stargazers_count?: number }) => {
        if (!repo.created_at) return;
        const d = new Date(repo.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!monthMap[key]) monthMap[key] = { repos: 0, stars: 0 };
        monthMap[key].repos++;
        monthMap[key].stars += repo.stargazers_count || 0;
      });
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      Object.entries(monthMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .forEach(([key, val]) => {
          const [, m] = key.split("-");
          growth.push({ month: months[parseInt(m, 10) - 1], repos: val.repos, stars: val.stars });
        });
    }

    const totalCommits = heatmap.reduce((sum, item) => sum + item.count, 0);
    const activeDays = countActiveDays(heatmap);

    return {
      success: true,
      data: {
        username,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url || "",
        bio: userData.bio || "",
        location: userData.location || "",
        followers: userData.followers || 0,
        following: userData.following || 0,
        publicRepos: userData.public_repos || 0,
        privateRepos,
        archivedRepos,
        forkedRepos,
        totalStars: stars,
        totalForks: forks,
        totalCommits,
        activeDays,
        totalPRs,
        totalIssues,
        streak: calculateStreak(heatmap),
        languages: JSON.stringify(languages),
        heatmap: JSON.stringify(heatmap),
        recentRepos: JSON.stringify(recentRepos),
        growth: JSON.stringify(growth),
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("GitHub scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeLeetcode(username: string) {
  try {
    const gqlRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify({
        query: `
          query userStats($username: String!) {
            matchedUser(username: $username) {
              submitStatsGlobal {
                acSubmissionNum { difficulty count }
                totalSubmissionNum { difficulty count }
              }
              profile { ranking reputation }
              userCalendar { submissionCalendar }
            }
            userContestRanking(username: $username) {
              attendedContestsCount rating globalRanking topPercentage
            }
            userContestRankingHistory(username: $username) {
              attended rating ranking
              contest { title startTime }
            }
          }
        `,
        variables: { username },
      }),
    });

    let stats: Record<string, unknown> = {};
    if (gqlRes.ok) {
      const result = await gqlRes.json();
      stats = (result.data as Record<string, unknown>) || {};
    }

    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let acceptance = "0%";
    let ranking = 0;
    let streak = 0;
    let leetcodeHeatmap: { date: string; count: number }[] = [];

    const matched = stats.matchedUser as {
      submitStatsGlobal?: {
        acSubmissionNum?: { difficulty: string; count: number }[];
        totalSubmissionNum?: { difficulty: string; count: number }[];
      };
      profile?: { ranking?: number };
      userCalendar?: { submissionCalendar?: string };
    } | null;

    if (matched) {
      const acs = matched.submitStatsGlobal?.acSubmissionNum || [];
      const totalSubs = matched.submitStatsGlobal?.totalSubmissionNum || [];
      const totalAllSubmissions = totalSubs.find((a) => a.difficulty === "All")?.count || 0;
      const acceptedAll = acs.find((a) => a.difficulty === "All")?.count || 0;
      if (totalAllSubmissions > 0) {
        acceptance = ((acceptedAll / totalAllSubmissions) * 100).toFixed(1) + "%";
      }
      totalSolved = acs.find((a) => a.difficulty === "All")?.count || 0;
      easySolved = acs.find((a) => a.difficulty === "Easy")?.count || 0;
      mediumSolved = acs.find((a) => a.difficulty === "Medium")?.count || 0;
      hardSolved = acs.find((a) => a.difficulty === "Hard")?.count || 0;
      ranking = matched.profile?.ranking || 0;

      if (matched.userCalendar?.submissionCalendar) {
        try {
          const cal = JSON.parse(matched.userCalendar.submissionCalendar) as Record<string, number>;
          leetcodeHeatmap = Object.entries(cal)
            .map(([ts, count]) => ({
              date: new Date(parseInt(ts, 10) * 1000).toISOString().split("T")[0],
              count,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
          streak = calculateStreak(leetcodeHeatmap);
        } catch {
          /* streak stays 0 */
        }
      }
    } else {
      const apiRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      if (!apiRes.ok) throw new Error("LeetCode profile not found");
      const apiData = await apiRes.json();
      if (apiData.status !== "success") throw new Error("LeetCode stats unavailable");
      totalSolved = apiData.totalSolved || 0;
      easySolved = apiData.easySolved || 0;
      mediumSolved = apiData.mediumSolved || 0;
      hardSolved = apiData.hardSolved || 0;
      acceptance = apiData.acceptanceRate ? `${apiData.acceptanceRate}%` : "0%";
      ranking = apiData.ranking || 0;
    }

    if (totalSolved === 0) throw new Error("No LeetCode solve data available");

    const contest = stats.userContestRanking as {
      rating?: number;
      topPercentage?: number;
    } | null;
    const history = (stats.userContestRankingHistory as {
      attended?: boolean;
      rating?: number;
      ranking?: number;
      contest?: { title?: string; startTime?: number };
    }[]) || [];

    const contestRating = contest?.rating ? Math.round(contest.rating) : 0;
    const contestRank = contest?.topPercentage
      ? `Top ${contest.topPercentage}%`
      : "N/A";

    const contestLogs = history
      .filter((h) => h.attended)
      .map((h) => ({
        name: h.contest?.title || "",
        rating: Math.round(h.rating || 0),
        rank: h.ranking || 0,
        date: h.contest?.startTime
          ? new Date(h.contest.startTime * 1000).toISOString()
          : null,
      }))
      .slice(-20);

    const topicSolve: { name: string; solved: number; total: number }[] = [];

    return {
      success: true,
      data: {
        username,
        solvedTotal: totalSolved,
        solvedEasy: easySolved,
        solvedMedium: mediumSolved,
        solvedHard: hardSolved,
        acceptance,
        streak,
        ranking,
        contestRating,
        contestRank,
        contestHistory: JSON.stringify(contestLogs),
        topicSolve: JSON.stringify(topicSolve),
        heatmap: JSON.stringify(leetcodeHeatmap),
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("LeetCode scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeCodeforces(username: string) {
  try {
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    if (!infoRes.ok) throw new Error("Codeforces handle query failed");
    const infoData = await infoRes.json();
    if (infoData.status !== "OK") throw new Error("Codeforces returns error status");
    const user = infoData.result[0];

    const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
    let ratingHistory: { contest: string; rating: number; rank: string; date?: string }[] = [];
    if (ratingRes.ok) {
      const ratingData = await ratingRes.json();
      if (ratingData.status === "OK") {
        ratingHistory = ratingData.result.map((r: {
          contestName: string;
          newRating: number;
          rank: string;
          ratingUpdateTimeSeconds?: number;
        }) => ({
          contest: r.contestName.substring(0, 40),
          rating: r.newRating,
          rank: r.rank,
          date: r.ratingUpdateTimeSeconds
            ? new Date(r.ratingUpdateTimeSeconds * 1000).toISOString()
            : undefined,
        }));
      }
    }

    const statusRes = await fetch(
      `https://codeforces.com/api/user.status?handle=${username}&from=1&count=500`
    );
    const tagsMap: Record<string, number> = {};
    const solvedProblems = new Set<string>();
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === "OK") {
        statusData.result
          .filter((s: { verdict?: string }) => s.verdict === "OK")
          .forEach((s: { problem?: { contestId?: number; index?: string; tags?: string[] } }) => {
            const key = `${s.problem?.contestId}-${s.problem?.index}`;
            if (solvedProblems.has(key)) return;
            solvedProblems.add(key);
            (s.problem?.tags || []).forEach((tag: string) => {
              tagsMap[tag] = (tagsMap[tag] || 0) + 1;
            });
          });
      }
    }

    const tags = Object.entries(tagsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return {
      success: true,
      data: {
        username,
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || "N/A",
        maxRank: user.maxRank || "N/A",
        solved: solvedProblems.size,
        history: JSON.stringify(ratingHistory.slice(-20)),
        tags: JSON.stringify(tags),
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Codeforces API error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeCodechef(username: string) {
  try {
    const res = await fetch(`https://www.codechef.com/users/${username}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100.0.0.0 Safari/537.36" },
    });
    if (!res.ok) throw new Error("CodeChef profile fetch failed");
    const html = await res.text();

    const rating = matchAnyNumber(html, [
      /<div class="rating-number">\s*(\d+)\s*<\/div>/,
      /CodeChef Rating[\s\S]*?<div class="rating-number">\s*(\d+)\s*<\/div>/,
    ]);
    const maxRating = parseNumberFromRegex(html, /<small>\(Highest Rating\s*(\d+)\)<\/small>/);
    const starBlock = matchRegex(html, /<div class="rating-star">([\s\S]*?)<\/div>/);
    const starCount = starBlock ? (starBlock.match(/&#9733;/g) || []).length : 0;
    const stars = matchRegex(html, /<span class="rating">([^<]+)<\/span>/) ||
      (starCount > 0 ? `${starCount} Star` : "N/A");
    const globalRank = matchAnyNumber(html, [
      /<strong>\s*([\d,]+)\s*<\/strong>\s*<\/a>\s*Global Rank/,
      /Global Rank:[\s\S]*?<strong[^>]*>\s*([\d,]+)\s*<\/strong>/,
    ]);
    const countryRank = matchAnyNumber(html, [
      /<strong>\s*([\d,]+)\s*<\/strong>\s*<\/a>\s*Country Rank/,
      /Country Rank:[\s\S]*?<strong[^>]*>\s*([\d,]+)\s*<\/strong>/,
    ]);
    const solved = matchAnyNumber(html, [
      /Solved:\s*([\d,]+)/i,
      /Fully Solved \(([\d,]+)\)/i,
    ]);

    if (rating === 0 && solved === 0) throw new Error("No CodeChef data parsed");

    return {
      success: true,
      data: {
        username,
        stars,
        rating,
        maxRating,
        globalRank,
        countryRank,
        solved,
        history: JSON.stringify([]),
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("CodeChef scrape failed:", message);
    return { success: false, error: message };
  }
}

export async function scrapeGfg(username: string) {
  try {
    const res = await fetch(`https://www.geeksforgeeks.org/user/${username}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!res.ok) throw new Error("GFG profile query failed");
    const html = await res.text();

    const codingScore = matchAnyNumber(html, [
      /Coding Score<\/span><span class="[^"]*">([\d,]+)/,
      /\\?"score\\?":([\d,]+)/,
    ]);
    const institutionRank = matchAnyNumber(html, [
      /Institution Rank<\/span><span class="[^"]*">#?([\d,]+)/,
      /\\?"institute_rank\\?":([\d,]+)/,
    ]);
    const solved = matchAnyNumber(html, [
      /Problems Solved<\/span><span class="[^"]*">([\d,]+)/,
      /\\?"total_problems_solved\\?":([\d,]+)/,
    ]);
    const streakMatch = matchRegex(html, /(\d+)\s*Day(?:s)?\s*Coding\s*Streak/i);
    const streak = streakMatch
      ? parseNumber(streakMatch)
      : parseNumberFromRegex(html, /\\?"pod_solved_longest_streak\\?":([\d,]+)/);

    if (solved === 0 && codingScore === 0) throw new Error("No GFG data parsed");

    return {
      success: true,
      data: {
        username,
        codingScore,
        institutionRank,
        solved,
        streak,
        practiceHistory: JSON.stringify([]),
        topicStrengths: JSON.stringify([]),
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("GFG scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeHackerrank(username: string) {
  try {
    const res = await fetch(`https://www.hackerrank.com/rest/contests/master/hackers/${username}/profile`, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    });
    if (!res.ok) throw new Error("HackerRank profile fetch failed");
    const parsed = await res.json();
    const data = parsed.model || {};

    if (!data.username && !data.name) throw new Error("HackerRank profile not found");

    const badges: string[] = [];
    const certifications: string[] = [];
    let challenges = 0;
    let rating = typeof data.level === "number" ? data.level * 100 : 0;
    let rank = 0;

    const badgesRes = await fetch(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    });
    if (badgesRes.ok) {
      const badgesPayload = await badgesRes.json();
      const badgeModels = Array.isArray(badgesPayload.models) ? badgesPayload.models : [];
      badgeModels.forEach((b: { badge_name?: string; stars?: number; solved?: number; current_points?: number; hacker_rank?: number }) => {
        if (b.badge_name) badges.push(`${b.badge_name}${b.stars ? ` (${b.stars} Star)` : ""}`);
        challenges += b.solved || 0;
        rating += Math.round(b.current_points || 0);
        if (b.hacker_rank && (!rank || b.hacker_rank < rank)) rank = b.hacker_rank;
      });
    }

    if (Array.isArray(data.certificates)) {
      data.certificates.forEach((c: { name?: string }) => {
        if (c.name) certifications.push(c.name);
      });
    }

    return {
      success: true,
      data: {
        username,
        rating,
        badges,
        certifications,
        challenges,
        rank,
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("HackerRank scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeHackerearth(username: string) {
  try {
    const normalizedUsername = username.trim().replace(/^@+/, "");
    const res = await fetch(`https://www.hackerearth.com/@${normalizedUsername}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!res.ok) throw new Error("HackerEarth profile fetch failed");
    const html = await res.text();

    const rating = parseNumberFromRegex(html, /Rating[^0-9]*(\d{3,4})/i);
    const rank = parseNumberFromRegex(html, /Global Rank[^0-9]*([\d,]+)/i);
    const challenges = parseNumberFromRegex(html, /([\d,]+)\s*problems?\s*solved/i);
    const hasProfileShell = new RegExp(`@?${normalizedUsername}`, "i").test(html) ||
      /Developer Profile on HackerEarth/i.test(html);

    if (!hasProfileShell && rating === 0 && challenges === 0) throw new Error("No HackerEarth data parsed");

    return {
      success: true,
      data: { username, rating, challenges, rank },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("HackerEarth scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeAtcoder(username: string) {
  try {
    const res = await fetch(`https://atcoder.jp/users/${username}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!res.ok) throw new Error("AtCoder profile fetch failed");
    const html = await res.text();

    const ratingCell = matchRegex(html, /<th[^>]*>Rating<\/th><td>([\s\S]*?)<\/td>/);
    const maxRatingCell = matchRegex(html, /<th[^>]*>Highest Rating<\/th><td>([\s\S]*?)<\/td>/);
    const rating = parseNumber(cleanText(ratingCell || ""));
    const maxRating = parseNumber(cleanText(maxRatingCell || ""));
    const rank = parseNumberFromRegex(html, /<th[^>]*>Rank<\/th><td>\s*([\d,]+)/);
    const challenges = matchAnyNumber(html, [
      /<th[^>]*>Rated Matches[\s\S]*?<\/th><td>\s*([\d,]+)/,
      /([\d,]+)\s*Problems/i,
    ]);

    if (rating === 0 && challenges === 0) throw new Error("No AtCoder data parsed");

    return {
      success: true,
      data: { username, rating, maxRating, rank, challenges },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("AtCoder scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeStackoverflow(username: string) {
  try {
    const keyParam = process.env.STACKEXCHANGE_KEY ? `&key=${process.env.STACKEXCHANGE_KEY}` : "";
    const res = await fetch(
      `https://api.stackexchange.com/2.3/users/${username}?site=stackoverflow${keyParam}`
    );
    if (!res.ok) throw new Error("StackOverflow profile fetch failed");
    const result = await res.json();
    const user = result.items?.[0];
    if (!user) throw new Error("StackOverflow user not found");

    return {
      success: true,
      data: {
        username: user.display_name || username,
        reputation: user.reputation || 0,
        badgesGold: user.badge_counts?.gold || 0,
        badgesSilver: user.badge_counts?.silver || 0,
        badgesBronze: user.badge_counts?.bronze || 0,
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("StackOverflow scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeDevto(username: string) {
  try {
    const res = await fetch(`https://dev.to/api/users/by_username?url=${username}`);
    if (!res.ok) throw new Error("Dev.to profile fetch failed");
    const user = await res.json();
    if (!user.id) throw new Error("Dev.to user not found");

    const articlesRes = await fetch(`https://dev.to/api/articles?username=${username}&per_page=100`);
    let reactions = 0;
    let articlesCount = 0;
    if (articlesRes.ok) {
      const articles = await articlesRes.json();
      articlesCount = articles.length;
      articles.forEach((a: { public_reactions_count?: number }) => {
        reactions += a.public_reactions_count || 0;
      });
    }

    return {
      success: true,
      data: {
        username,
        articles: articlesCount,
        reactions,
        followers: user.followers_count || 0,
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Dev.to scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeLinkedin(_username: string) {
  return { success: false, error: "LinkedIn integration deferred — no public API available" };
}

export async function scrapeKaggle(username: string) {
  try {
    if (process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY) {
      const auth = Buffer.from(`${process.env.KAGGLE_USERNAME}:${process.env.KAGGLE_KEY}`).toString("base64");
      const res = await fetch(`https://www.kaggle.com/api/v1/users/${username}`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (res.ok) {
        const user = await res.json();
        return {
          success: true,
          data: {
            username,
            points: (user.totalGoldMedals || 0) * 100 + (user.totalSilverMedals || 0) * 50 + (user.totalBronzeMedals || 0) * 25,
            rank: user.rankCurrent || 0,
            tier: user.performanceTier || "Novice",
          },
        };
      }
    }

    const res = await fetch(`https://www.kaggle.com/${username}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!res.ok) throw new Error("Kaggle profile fetch failed");
    const html = await res.text();

    const points = parseNumberFromRegex(html, /([\d,]+)\s*Total Points/i);
    const rank = parseNumberFromRegex(html, /Rank[^0-9]*([\d,]+)/i);
    const tierMatch = matchRegex(html, /(Novice|Contributor|Expert|Master|Grandmaster)/i);
    const hasProfileShell = new RegExp(username, "i").test(html) || /Kaggle profile/i.test(html);

    if (!hasProfileShell && points === 0 && rank === 0) throw new Error("No Kaggle data parsed");

    return {
      success: true,
      data: {
        username,
        points,
        rank,
        tier: tierMatch || "Novice",
      },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Kaggle scrape error:", message);
    return { success: false, error: message };
  }
}

export async function scrapeCode360(username: string) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.naukri.com/",
  };

  // Try multiple URL patterns
  const urls = [
    `https://www.naukri.com/code360/profile/${username}`,
    `https://www.naukri.com/code360/api/v1/users/profile/${username}`,
    `https://www.codingninjas.com/studio/profile/${username}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers, redirect: "follow" });
      if (!res.ok) continue;
      const html = await res.text();

      // Check for JSON response (API endpoint)
      if (html.trim().startsWith("{") || html.trim().startsWith("[")) {
        try {
          const json = JSON.parse(html);
          const data = json.data || json.profile || json.user || json;
          return {
            success: true,
            data: {
              username,
              solved: data.problemsSolved ?? data.solved ?? data.totalProblemsSolved ?? 0,
              rating: data.rating ?? data.contestRating ?? 0,
              streak: data.streak ?? data.currentStreak ?? 0,
              stars: data.stars ?? data.starRating ?? "N/A",
            },
          };
        } catch { /* not JSON, continue */ }
      }

      // Parse HTML response
      const solved = matchAnyNumber(html, [
        /problems?\s*solved[:\s]*(\d[\d,]*)/i,
        /(\d[\d,]*)\s*problems?\s*solved/i,
        /"problemsSolved"[:\s]*(\d[\d,]*)/i,
        /solved[:\s]*(\d[\d,]*)/i,
        /"totalProblemsSolved"[:\s]*(\d[\d,]*)/i,
      ]);

      const rating = matchAnyNumber(html, [
        /rating[:\s]*(\d[\d,]*)/i,
        /"rating"[:\s]*(\d[\d,]*)/i,
        /(\d[\d,]*)\s*rating/i,
        /"contestRating"[:\s]*(\d[\d,]*)/i,
      ]);

      const streak = matchAnyNumber(html, [
        /streak[:\s]*(\d[\d,]*)/i,
        /"streak"[:\s]*(\d[\d,]*)/i,
        /(\d[\d,]*)\s*days?\s*streak/i,
        /"currentStreak"[:\s]*(\d[\d,]*)/i,
      ]);

      const starsMatch = matchRegex(html, /(\d+\.?\d*)\s*stars?/i) || matchRegex(html, /"stars"[:\s]*"?(\d+\.?\d*)"?/i) || matchRegex(html, /"starRating"[:\s]*"?([^",}]+)"?/i);
      const stars = starsMatch || "N/A";

      const hasProfile = new RegExp(username, "i").test(html) || /code360|coding.?ninja/i.test(html);
      if (hasProfile || solved > 0 || rating > 0) {
        return {
          success: true,
          data: { username, solved, rating, streak, stars },
        };
      }
    } catch { /* try next URL */ }
  }

  // All attempts failed - return graceful failure
  return {
    success: false,
    error: "Code360 profile could not be fetched. The platform blocks server-side requests. Data may need to be synced manually or via a browser-based approach.",
  };
}

export async function scrapeInterviewbit(username: string) {
  try {
    const res = await fetch(`https://www.interviewbit.com/profile/${username}/`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!res.ok) throw new Error("InterviewBit profile fetch failed");
    const html = await res.text();

    const score = matchAnyNumber(html, [
      /score[:\s]*(\d[\d,]*)/i,
      /"score"[:\s]*(\d[\d,]*)/i,
      /(\d[\d,]*)\s*score/i,
      /total\s*score[:\s]*(\d[\d,]*)/i,
    ]);

    const rank = matchAnyNumber(html, [
      /rank[:\s]*#?(\d[\d,]*)/i,
      /"rank"[:\s]*(\d[\d,]*)/i,
      /#(\d[\d,]*)\s*rank/i,
    ]);

    const solved = matchAnyNumber(html, [
      /problems?\s*solved[:\s]*(\d[\d,]*)/i,
      /(\d[\d,]*)\s*problems?\s*solved/i,
      /"problemsSolved"[:\s]*(\d[\d,]*)/i,
      /solved[:\s]*(\d[\d,]*)/i,
    ]);

    const streak = matchAnyNumber(html, [
      /streak[:\s]*(\d[\d,]*)/i,
      /"streak"[:\s]*(\d[\d,]*)/i,
      /(\d[\d,]*)\s*days?\s*streak/i,
    ]);

    const hasProfile = new RegExp(username, "i").test(html) || /interviewbit.*profile/i.test(html);
    if (!hasProfile && score === 0 && solved === 0) throw new Error("No InterviewBit data parsed");

    return {
      success: true,
      data: { username, score, rank, solved, streak },
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("InterviewBit scrape error:", message);
    return { success: false, error: message };
  }
}
