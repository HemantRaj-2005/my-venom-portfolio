import { db } from "./db";
import { DevStatsPayload, generateMockStats } from "./mock-stats";

// Perform real synchronization with configured platforms only
export async function syncDeveloperStats(profileId: string): Promise<DevStatsPayload> {
  const profile = await db.devProfile.findUnique({ where: { id: profileId } });
  if (!profile) {
    throw new Error("Target Developer Profile not found in database registry.");
  }

  // Start with zeroed baseline — only real API data fills this
  const stats = generateMockStats(
    profile.github || "",
    profile.leetcode || "",
    profile.codeforces || "",
    profile.codechef || "",
    profile.geeksforgeeks || ""
  );

  // 1. Sync GitHub profile if handle is configured
  if (profile.github) {
    try {
      const userRes = await fetch(`https://api.github.com/users/${profile.github}`, {
        headers: { "User-Agent": "Venom-Portfolio-Sync" },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        stats.github.profile.name = userData.name || userData.login;
        stats.github.profile.bio = userData.bio || "";
        stats.github.profile.location = userData.location || "";
        stats.github.profile.followers = userData.followers || 0;
        stats.github.profile.following = userData.following || 0;
        stats.github.profile.publicRepos = userData.public_repos || 0;
        stats.github.profile.avatarUrl = userData.avatar_url || "";

        // Fetch repository stars and forks
        const reposRes = await fetch(`https://api.github.com/users/${profile.github}/repos?per_page=100`, {
          headers: { "User-Agent": "Venom-Portfolio-Sync" },
        });
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          let stars = 0;
          let forks = 0;
          let recentRepos: any[] = [];
          if (Array.isArray(reposData)) {
            reposData.forEach((repo: any) => {
              stars += repo.stargazers_count || 0;
              forks += repo.forks_count || 0;
            });
            stats.github.metrics.totalStars = stars;
            stats.github.metrics.totalForks = forks;
            // Top 4 repos by stars
            recentRepos = reposData
              .sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
              .slice(0, 4)
              .map((repo: any) => ({
                name: repo.name,
                desc: repo.description || "",
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
                language: repo.language || "Unknown",
                url: repo.html_url || `https://github.com/${profile.github}/${repo.name}`,
              }));
            stats.github.recentRepos = recentRepos;
          }
        }
      }
    } catch (e) {
      console.warn("GitHub sync failed:", e);
    }
  }

  // 2. Sync LeetCode if handle is configured
  if (profile.leetcode) {
    try {
      const leetcodeRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${profile.leetcode}`);
      if (leetcodeRes.ok) {
        const leetcodeData = await leetcodeRes.json();
        if (leetcodeData.status === "success") {
          stats.leetcode.solved.total = leetcodeData.totalSolved || 0;
          stats.leetcode.solved.easy = leetcodeData.easySolved || 0;
          stats.leetcode.solved.medium = leetcodeData.mediumSolved || 0;
          stats.leetcode.solved.hard = leetcodeData.hardSolved || 0;
          stats.leetcode.acceptance = `${leetcodeData.acceptanceRate || 0}%`;
        }
      }
    } catch (e) {
      console.warn("LeetCode sync failed:", e);
    }
  }

  // 3. Sync Codeforces if handle is configured
  if (profile.codeforces) {
    try {
      const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=${profile.codeforces}`);
      if (cfRes.ok) {
        const cfData = await cfRes.json();
        if (cfData.status === "OK" && cfData.result?.[0]) {
          const user = cfData.result[0];
          stats.codeforces.rating = user.rating || 0;
          stats.codeforces.maxRating = user.maxRating || 0;
          stats.codeforces.rank = user.rank || "N/A";
        }
      }
    } catch (e) {
      console.warn("Codeforces sync failed:", e);
    }
  }

  // 4. Compute an aura score from available synced data
  const syncedPlatforms = [profile.github, profile.leetcode, profile.codeforces, profile.codechef, profile.geeksforgeeks]
    .filter(Boolean).length;
  stats.auraScore = syncedPlatforms > 0 ? Math.min(syncedPlatforms * 20, 100) : 0;

  // 5. Persist updated stats
  const updatedStats = {
    ...stats,
    lastSynced: new Date().toLocaleString(),
    isSynced: true,
  };

  await db.devProfile.update({
    where: { id: profileId },
    data: { statsCache: JSON.stringify(updatedStats) },
  });

  return updatedStats;
}
