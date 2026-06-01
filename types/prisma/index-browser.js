
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.21.1
 * Query Engine version: bf0e5e8a04cada8225617067eaa03d041e2bba36
 */
Prisma.prismaVersion = {
  client: "5.21.1",
  engine: "bf0e5e8a04cada8225617067eaa03d041e2bba36"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  image: 'image',
  hashedPassword: 'hashedPassword',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  company: 'company',
  budget: 'budget',
  timeline: 'timeline',
  requirements: 'requirements',
  projectType: 'projectType',
  preferredTime: 'preferredTime',
  createdAt: 'createdAt',
  status: 'status'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  price: 'price',
  category: 'category',
  githubUrl: 'githubUrl',
  demoUrl: 'demoUrl',
  downloadUrl: 'downloadUrl',
  image: 'image',
  features: 'features',
  licensing: 'licensing',
  isFeatured: 'isFeatured',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RatingScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  rating: 'rating',
  comment: 'comment',
  author: 'author',
  createdAt: 'createdAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  overview: 'overview',
  features: 'features',
  challenges: 'challenges',
  architecture: 'architecture',
  techStack: 'techStack',
  schemaUrl: 'schemaUrl',
  apiFlow: 'apiFlow',
  deployment: 'deployment',
  gallery: 'gallery',
  demoVideo: 'demoVideo',
  liveUrl: 'liveUrl',
  githubUrl: 'githubUrl',
  performance: 'performance',
  seoTitle: 'seoTitle',
  seoDesc: 'seoDesc',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  summary: 'summary',
  published: 'published',
  tags: 'tags',
  category: 'category',
  readTime: 'readTime',
  featuredImage: 'featuredImage',
  seoTitle: 'seoTitle',
  seoDesc: 'seoDesc',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  author: 'author',
  email: 'email',
  content: 'content',
  createdAt: 'createdAt'
};

exports.Prisma.VisitorLogScalarFieldEnum = {
  id: 'id',
  ip: 'ip',
  userAgent: 'userAgent',
  device: 'device',
  browser: 'browser',
  os: 'os',
  path: 'path',
  referrer: 'referrer',
  createdAt: 'createdAt'
};

exports.Prisma.CallbackRequestScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  timeSlot: 'timeSlot',
  message: 'message',
  createdAt: 'createdAt',
  status: 'status'
};

exports.Prisma.ContactMessageScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  subject: 'subject',
  message: 'message',
  createdAt: 'createdAt',
  status: 'status'
};

exports.Prisma.NewsletterSubscriberScalarFieldEnum = {
  id: 'id',
  email: 'email',
  createdAt: 'createdAt'
};

exports.Prisma.DevProfileScalarFieldEnum = {
  id: 'id',
  name: 'name',
  bio: 'bio',
  roles: 'roles',
  github: 'github',
  leetcode: 'leetcode',
  codeforces: 'codeforces',
  codechef: 'codechef',
  geeksforgeeks: 'geeksforgeeks',
  hackerrank: 'hackerrank',
  atcoder: 'atcoder',
  hackerearth: 'hackerearth',
  stackoverflow: 'stackoverflow',
  devto: 'devto',
  kaggle: 'kaggle',
  code360: 'code360',
  interviewbit: 'interviewbit',
  resumeUrl: 'resumeUrl',
  statsCache: 'statsCache',
  platformVisibility: 'platformVisibility',
  aiInsightsEnabled: 'aiInsightsEnabled',
  updatedAt: 'updatedAt'
};

exports.Prisma.FaqScalarFieldEnum = {
  id: 'id',
  question: 'question',
  answer: 'answer',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExperienceScalarFieldEnum = {
  id: 'id',
  year: 'year',
  title: 'title',
  description: 'description',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GithubProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  name: 'name',
  avatarUrl: 'avatarUrl',
  bio: 'bio',
  location: 'location',
  followers: 'followers',
  following: 'following',
  publicRepos: 'publicRepos',
  privateRepos: 'privateRepos',
  archivedRepos: 'archivedRepos',
  forkedRepos: 'forkedRepos',
  totalStars: 'totalStars',
  totalForks: 'totalForks',
  totalPRs: 'totalPRs',
  totalIssues: 'totalIssues',
  totalCommits: 'totalCommits',
  activeDays: 'activeDays',
  streak: 'streak',
  languages: 'languages',
  heatmap: 'heatmap',
  recentRepos: 'recentRepos',
  growth: 'growth',
  updatedAt: 'updatedAt'
};

exports.Prisma.GithubHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  commits: 'commits',
  stars: 'stars',
  prs: 'prs',
  issues: 'issues',
  createdAt: 'createdAt'
};

exports.Prisma.LeetcodeProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  solvedTotal: 'solvedTotal',
  solvedEasy: 'solvedEasy',
  solvedMedium: 'solvedMedium',
  solvedHard: 'solvedHard',
  acceptance: 'acceptance',
  streak: 'streak',
  ranking: 'ranking',
  contestRating: 'contestRating',
  contestRank: 'contestRank',
  contestHistory: 'contestHistory',
  topicSolve: 'topicSolve',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeetcodeHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  solvedTotal: 'solvedTotal',
  rating: 'rating',
  createdAt: 'createdAt'
};

exports.Prisma.CodeforcesProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  rating: 'rating',
  maxRating: 'maxRating',
  rank: 'rank',
  maxRank: 'maxRank',
  solved: 'solved',
  history: 'history',
  tags: 'tags',
  updatedAt: 'updatedAt'
};

exports.Prisma.CodeforcesHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  rating: 'rating',
  solved: 'solved',
  createdAt: 'createdAt'
};

exports.Prisma.CodechefProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  stars: 'stars',
  rating: 'rating',
  maxRating: 'maxRating',
  globalRank: 'globalRank',
  countryRank: 'countryRank',
  solved: 'solved',
  history: 'history',
  updatedAt: 'updatedAt'
};

exports.Prisma.CodechefHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  rating: 'rating',
  solved: 'solved',
  createdAt: 'createdAt'
};

exports.Prisma.GfgProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  codingScore: 'codingScore',
  institutionRank: 'institutionRank',
  solved: 'solved',
  streak: 'streak',
  practiceHistory: 'practiceHistory',
  topicStrengths: 'topicStrengths',
  updatedAt: 'updatedAt'
};

exports.Prisma.GfgHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  codingScore: 'codingScore',
  solved: 'solved',
  createdAt: 'createdAt'
};

exports.Prisma.HackerrankProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  rating: 'rating',
  badges: 'badges',
  certifications: 'certifications',
  challenges: 'challenges',
  rank: 'rank',
  updatedAt: 'updatedAt'
};

exports.Prisma.HackerearthProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  rating: 'rating',
  challenges: 'challenges',
  rank: 'rank',
  updatedAt: 'updatedAt'
};

exports.Prisma.AtcoderProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  rating: 'rating',
  maxRating: 'maxRating',
  rank: 'rank',
  challenges: 'challenges',
  updatedAt: 'updatedAt'
};

exports.Prisma.HackerrankHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  rating: 'rating',
  challenges: 'challenges',
  createdAt: 'createdAt'
};

exports.Prisma.HackerearthHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  rating: 'rating',
  challenges: 'challenges',
  createdAt: 'createdAt'
};

exports.Prisma.AtcoderHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  rating: 'rating',
  createdAt: 'createdAt'
};

exports.Prisma.StackoverflowHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  reputation: 'reputation',
  createdAt: 'createdAt'
};

exports.Prisma.DevtoHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  articles: 'articles',
  reactions: 'reactions',
  createdAt: 'createdAt'
};

exports.Prisma.KaggleHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  points: 'points',
  rank: 'rank',
  createdAt: 'createdAt'
};

exports.Prisma.SyncLogScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  status: 'status',
  message: 'message',
  duration: 'duration',
  createdAt: 'createdAt'
};

exports.Prisma.StackoverflowProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  reputation: 'reputation',
  badgesGold: 'badgesGold',
  badgesSilver: 'badgesSilver',
  badgesBronze: 'badgesBronze',
  updatedAt: 'updatedAt'
};

exports.Prisma.DevtoProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  articles: 'articles',
  reactions: 'reactions',
  followers: 'followers',
  updatedAt: 'updatedAt'
};

exports.Prisma.LinkedinProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  followers: 'followers',
  connections: 'connections',
  posts: 'posts',
  impressions: 'impressions',
  updatedAt: 'updatedAt'
};

exports.Prisma.KaggleProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  points: 'points',
  rank: 'rank',
  tier: 'tier',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContestHistoryScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  contestId: 'contestId',
  name: 'name',
  date: 'date',
  rating: 'rating',
  rank: 'rank',
  createdAt: 'createdAt'
};

exports.Prisma.ActivityHistoryScalarFieldEnum = {
  id: 'id',
  platform: 'platform',
  date: 'date',
  count: 'count',
  details: 'details',
  createdAt: 'createdAt'
};

exports.Prisma.AiReportScalarFieldEnum = {
  id: 'id',
  developerLevel: 'developerLevel',
  strengths: 'strengths',
  weaknesses: 'weaknesses',
  dsaAnalysis: 'dsaAnalysis',
  contestForecast: 'contestForecast',
  gitAnalysis: 'gitAnalysis',
  careerReadiness: 'careerReadiness',
  predictions: 'predictions',
  rawSummary: 'rawSummary',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsSnapshotScalarFieldEnum = {
  id: 'id',
  date: 'date',
  metrics: 'metrics',
  overallScore: 'overallScore'
};

exports.Prisma.Code360ProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  solved: 'solved',
  stars: 'stars',
  rating: 'rating',
  streak: 'streak',
  updatedAt: 'updatedAt'
};

exports.Prisma.Code360HistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  solved: 'solved',
  rating: 'rating',
  createdAt: 'createdAt'
};

exports.Prisma.InterviewbitProfileScalarFieldEnum = {
  id: 'id',
  username: 'username',
  score: 'score',
  rank: 'rank',
  solved: 'solved',
  streak: 'streak',
  updatedAt: 'updatedAt'
};

exports.Prisma.InterviewbitHistoryScalarFieldEnum = {
  id: 'id',
  username: 'username',
  date: 'date',
  score: 'score',
  solved: 'solved',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};


exports.Prisma.ModelName = {
  User: 'User',
  Lead: 'Lead',
  Product: 'Product',
  Rating: 'Rating',
  Project: 'Project',
  Post: 'Post',
  Comment: 'Comment',
  VisitorLog: 'VisitorLog',
  CallbackRequest: 'CallbackRequest',
  ContactMessage: 'ContactMessage',
  NewsletterSubscriber: 'NewsletterSubscriber',
  DevProfile: 'DevProfile',
  Faq: 'Faq',
  Experience: 'Experience',
  GithubProfile: 'GithubProfile',
  GithubHistory: 'GithubHistory',
  LeetcodeProfile: 'LeetcodeProfile',
  LeetcodeHistory: 'LeetcodeHistory',
  CodeforcesProfile: 'CodeforcesProfile',
  CodeforcesHistory: 'CodeforcesHistory',
  CodechefProfile: 'CodechefProfile',
  CodechefHistory: 'CodechefHistory',
  GfgProfile: 'GfgProfile',
  GfgHistory: 'GfgHistory',
  HackerrankProfile: 'HackerrankProfile',
  HackerearthProfile: 'HackerearthProfile',
  AtcoderProfile: 'AtcoderProfile',
  HackerrankHistory: 'HackerrankHistory',
  HackerearthHistory: 'HackerearthHistory',
  AtcoderHistory: 'AtcoderHistory',
  StackoverflowHistory: 'StackoverflowHistory',
  DevtoHistory: 'DevtoHistory',
  KaggleHistory: 'KaggleHistory',
  SyncLog: 'SyncLog',
  StackoverflowProfile: 'StackoverflowProfile',
  DevtoProfile: 'DevtoProfile',
  LinkedinProfile: 'LinkedinProfile',
  KaggleProfile: 'KaggleProfile',
  ContestHistory: 'ContestHistory',
  ActivityHistory: 'ActivityHistory',
  AiReport: 'AiReport',
  AnalyticsSnapshot: 'AnalyticsSnapshot',
  Code360Profile: 'Code360Profile',
  Code360History: 'Code360History',
  InterviewbitProfile: 'InterviewbitProfile',
  InterviewbitHistory: 'InterviewbitHistory'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
