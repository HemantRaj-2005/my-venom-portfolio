import { db } from "./db";
import { DevStatsPayload, generateMockStats } from "./mock-stats";

// Perform real synchronization with platforms (falling back to mock metrics where offline/unconfigured)
export async function syncDeveloperStats(profileId: string): Promise<DevStatsPayload> {
  const profile = await db.devProfile.findUnique({ where: { id: profileId } });
  if (!profile) {
    throw new Error("Target Developer Profile not found in database registry.");
  }

  // Start with default mock stats
  const stats = generateMockStats(
    profile.github || "HemantRaj-2005",
    profile.leetcode || "HemantRaj-2005",
    profile.codeforces || "HemantRaj-2005",
    profile.codechef || "hemant_2005",
    profile.geeksforgeeks || "hemantraj2005"
  );

  // 1. Try syncing real GitHub profile statistics
  if (profile.github) {
    try {
      const userRes = await fetch(`https://api.github.com/users/${profile.github}`, {
        headers: { "User-Agent": "Venom-Portfolio-Sync" },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        stats.github.profile.name = userData.name || userData.login;
        stats.github.profile.bio = userData.bio || stats.github.profile.bio;
        stats.github.profile.location = userData.location || stats.github.profile.location;
        stats.github.profile.followers = userData.followers;
        stats.github.profile.following = userData.following;
        stats.github.profile.publicRepos = userData.public_repos;
        stats.github.profile.avatarUrl = userData.avatar_url;

        // Try getting user repository stars count
        const reposRes = await fetch(`https://api.github.com/users/${profile.github}/repos?per_page=100`, {
          headers: { "User-Agent": "Venom-Portfolio-Sync" },
        });
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          let stars = 0;
          let forks = 0;
          if (Array.isArray(reposData)) {
            reposData.forEach((repo: any) => {
              stars += repo.stargazers_count || 0;
              forks += repo.forks_count || 0;
            });
            stats.github.metrics.totalStars = stars || stats.github.metrics.totalStars;
            stats.github.metrics.totalForks = forks || stats.github.metrics.totalForks;
          }
        }
      }
    } catch (e) {
      console.warn("GitHub real sync failed, falling back to preseeded schema metrics:", e);
    }
  }

  // 2. Try LeetCode sync (unofficial API node)
  if (profile.leetcode) {
    try {
      const leetcodeRes = await fetch(`https://leetcode-stats-api.herokuapp.com/${profile.leetcode}`);
      if (leetcodeRes.ok) {
        const leetcodeData = await leetcodeRes.json();
        if (leetcodeData.status === "success") {
          stats.leetcode.solved.total = leetcodeData.totalSolved;
          stats.leetcode.solved.easy = leetcodeData.easySolved;
          stats.leetcode.solved.medium = leetcodeData.mediumSolved;
          stats.leetcode.solved.hard = leetcodeData.hardSolved;
          stats.leetcode.acceptance = `${leetcodeData.acceptanceRate}%`;
        }
      }
    } catch (e) {
      console.warn("LeetCode API sync failed, using dynamic local fallbacks:", e);
    }
  }

  // 3. Try Codeforces API lookup
  if (profile.codeforces) {
    try {
      const cfRes = await fetch(`https://codeforces.com/api/user.info?handles=${profile.codeforces}`);
      if (cfRes.ok) {
        const cfData = await cfRes.json();
        if (cfData.status === "OK" && cfData.result?.[0]) {
          const user = cfData.result[0];
          stats.codeforces.rating = user.rating || stats.codeforces.rating;
          stats.codeforces.maxRating = user.maxRating || stats.codeforces.maxRating;
          stats.codeforces.rank = user.rank || stats.codeforces.rank;
        }
      }
    } catch (e) {
      console.warn("Codeforces API sync failed, utilizing fallback timelines:", e);
    }
  }

  // 4. Update the DevProfile record with updated statistics JSON
  const updatedStats = {
    ...stats,
    lastSynced: new Date().toLocaleString(),
  };

  await db.devProfile.update({
    where: { id: profileId },
    data: {
      statsCache: JSON.stringify(updatedStats),
    },
  });

  return updatedStats;
}
