"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, Calendar, Mail, FileDown, LogOut, CheckCircle, 
  Trash2, Search, BarChart3, Database, Package, FileText, Download,
  ShieldAlert, Cpu, RefreshCw, HelpCircle, Plus, ArrowUp, ArrowDown,
  Upload, FileCheck, AlertCircle, X
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, Cell 
} from "recharts";

// Interfaces for DB records
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  timeline: string;
  requirements: string;
  projectType: string;
  status: string;
  createdAt: string;
}

interface Callback {
  id: string;
  name: string;
  email: string;
  phone: string;
  timeSlot: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

interface Visitor {
  id: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  path: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Selected tab state
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "callbacks" | "messages" | "subscribers" | "visitors" | "integrations" | "faqs" | "blogs" | "resume" | "experience" | "projects">("overview");

  // Database lists
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  // Profile metadata & Integration handles state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [roles, setRoles] = useState(""); // Comma separated in input
  const [github, setGithub] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [codechef, setCodechef] = useState("");
  const [geeksforgeeks, setGeeksforgeeks] = useState("");
  const [hackerrank, setHackerrank] = useState("");
  const [atcoder, setAtcoder] = useState("");
  const [hackerearth, setHackerearth] = useState("");
  const [stackoverflow, setStackoverflow] = useState("");
  const [devto, setDevto] = useState("");
  const [kaggle, setKaggle] = useState("");
  const [code360, setCode360] = useState("");
  const [interviewbit, setInterviewbit] = useState("");
  const [syncLogs, setSyncLogs] = useState<{ platform: string; status: string; message: string | null; duration: number | null; createdAt: string }[]>([]);
  const [envStatus, setEnvStatus] = useState<{ githubToken: boolean; geminiKey: boolean; stackexchangeKey: boolean; kaggleKeys: boolean } | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Experience timeline states
  const [experiences, setExperiences] = useState<any[]>([]);
  const [expYear, setExpYear] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expOrder, setExpOrder] = useState(0);
  const [expId, setExpId] = useState(""); // for edit mode
  const [expLoading, setExpLoading] = useState(false);

  // Resume upload state
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploadStatus, setResumeUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [resumeUploadMessage, setResumeUploadMessage] = useState("");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Blog states & editors
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogEditorOpen, setBlogEditorOpen] = useState(false);
  
  // Blog form state
  const [blogId, setBlogId] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogCategory, setBlogCategory] = useState("Development");
  const [blogReadTime, setBlogReadTime] = useState(5);
  const [blogTags, setBlogTags] = useState("");
  const [blogPublished, setBlogPublished] = useState(false);
  const [blogSummary, setBlogSummary] = useState("");
  const [blogSeoTitle, setBlogSeoTitle] = useState("");
  const [blogSeoDesc, setBlogSeoDesc] = useState("");
  const [blogFeaturedImage, setBlogFeaturedImage] = useState("");
  const [blogImageUploading, setBlogImageUploading] = useState(false);
  const [blogBlocks, setBlogBlocks] = useState<any[]>([]);

  // Project states & editor
  const [projects, setProjects] = useState<any[]>([]);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectEditorOpen, setProjectEditorOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [projectFeatures, setProjectFeatures] = useState("");
  const [projectChallenges, setProjectChallenges] = useState("");
  const [projectArchitecture, setProjectArchitecture] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectSchemaUrl, setProjectSchemaUrl] = useState("");
  const [projectApiFlow, setProjectApiFlow] = useState("");
  const [projectDeployment, setProjectDeployment] = useState("");
  const [projectGallery, setProjectGallery] = useState<string[]>([]);
  const [projectDemoVideo, setProjectDemoVideo] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [projectPerformance, setProjectPerformance] = useState<number | "">("");
  const [projectSeoTitle, setProjectSeoTitle] = useState("");
  const [projectSeoDesc, setProjectSeoDesc] = useState("");
  const [projectImageUploading, setProjectImageUploading] = useState(false);

  const addBlogBlock = (type: string) => {
    let newBlock = {};
    if (type === "header") {
      newBlock = { type: "header", content: "Section Header", level: 2 };
    } else if (type === "paragraph") {
      newBlock = { type: "paragraph", content: "Paragraph content..." };
    } else if (type === "code") {
      newBlock = { type: "code", content: "// Paste code here", language: "typescript" };
    } else if (type === "quote") {
      newBlock = { type: "quote", content: "Important quote" };
    } else if (type === "callout") {
      newBlock = { type: "callout", content: "Callout warning text...", calloutType: "info" };
    } else if (type === "image") {
      newBlock = { type: "image", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800", caption: "Caption" };
    }
    setBlogBlocks([...blogBlocks, newBlock]);
  };

  const updateBlogBlock = (index: number, fields: any) => {
    const updated = [...blogBlocks];
    updated[index] = { ...updated[index], ...fields };
    setBlogBlocks(updated);
  };

  const deleteBlogBlock = (index: number) => {
    const updated = [...blogBlocks];
    updated.splice(index, 1);
    setBlogBlocks(updated);
  };

  const moveBlogBlock = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blogBlocks.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...blogBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setBlogBlocks(updated);
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.posts || []);
      }
    } catch (e) {
      console.error("Error fetching blogs:", e);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await fetch("/api/admin/resume");
      const data = await res.json();
      if (data.success) {
        setCurrentResumeUrl(data.resumeUrl || null);
      }
    } catch (e) {
      console.error("Error fetching resume:", e);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      setResumeUploadStatus("error");
      setResumeUploadMessage("Please select a PDF file first.");
      return;
    }
    setResumeUploading(true);
    setResumeUploadStatus("idle");
    setResumeUploadMessage("");
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const form = new FormData();
      form.append("resume", resumeFile);
      const res = await fetch("/api/admin/resume", { method: "POST", body: form });
      const result = await res.json();
      if (result.success) {
        setCurrentResumeUrl(result.resumeUrl);
        setResumeFile(null);
        setResumeUploadStatus("success");
        setResumeUploadMessage("Resume uploaded successfully and is now live.");
      } else {
        setResumeUploadStatus("error");
        setResumeUploadMessage(result.error || "Upload failed.");
      }
    } catch (e) {
      setResumeUploadStatus("error");
      setResumeUploadMessage("Network error. Please try again.");
    } finally {
      setResumeUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm("Remove the current resume? It will no longer be publicly accessible.")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/admin/resume", { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setCurrentResumeUrl(null);
        setResumeUploadStatus("success");
        setResumeUploadMessage("Resume removed successfully.");
      } else {
        setResumeUploadStatus("error");
        setResumeUploadMessage(result.error || "Delete failed.");
      }
    } catch (e) {
      setResumeUploadStatus("error");
      setResumeUploadMessage("Network error during deletion.");
    }
  };

  const handleOpenBlogEditor = (post?: any) => {
    if (post) {
      setBlogId(post.id);
      setBlogTitle(post.title);
      setBlogSlug(post.slug);
      setBlogCategory(post.category || "Development");
      setBlogReadTime(post.readTime || 5);
      setBlogTags(post.tags?.join(", ") || "");
      setBlogPublished(post.published);
      setBlogSummary(post.summary || "");
      setBlogSeoTitle(post.seoTitle || "");
      setBlogSeoDesc(post.seoDesc || "");
      setBlogFeaturedImage(post.featuredImage || "");
      try {
        if (post.content && post.content.trim().startsWith("[")) {
          setBlogBlocks(JSON.parse(post.content));
        } else {
          setBlogBlocks([{ type: "paragraph", content: post.content || "" }]);
        }
      } catch (e) {
        setBlogBlocks([{ type: "paragraph", content: post.content || "" }]);
      }
    } else {
      setBlogId("");
      setBlogTitle("");
      setBlogSlug("");
      setBlogCategory("Development");
      setBlogReadTime(5);
      setBlogTags("");
      setBlogPublished(false);
      setBlogSummary("");
      setBlogSeoTitle("");
      setBlogSeoDesc("");
      setBlogFeaturedImage("");
      setBlogBlocks([
        { type: "header", content: "New Dynamic Ledger Entry", level: 2 },
        { type: "paragraph", content: "Write details here..." }
      ]);
    }
    setBlogEditorOpen(true);
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBlogImageUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/admin/blogs/upload", { method: "POST", body: form });
      const result = await res.json();
      if (result.success && result.url) {
        setBlogFeaturedImage(result.url);
      } else {
        alert(result.error || "Image upload failed.");
      }
    } catch {
      alert("Network error uploading image.");
    } finally {
      setBlogImageUploading(false);
    }
  };

  const handleSaveBlog = async () => {
    if (!blogTitle.trim() || !blogSlug.trim()) {
      alert("Title and Slug are required.");
      return;
    }
    setBlogLoading(true);
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const tagsArray = blogTags.split(",").map(t => t.trim()).filter(Boolean);
      const contentString = JSON.stringify(blogBlocks);

      const payload = {
        id: blogId || undefined,
        title: blogTitle,
        slug: blogSlug,
        content: contentString,
        summary: blogSummary || (blogBlocks.find(b => b.type === "paragraph")?.content?.slice(0, 150) + "...") || "",
        published: blogPublished,
        tags: tagsArray,
        category: blogCategory,
        readTime: Number(blogReadTime) || 5,
        featuredImage: blogFeaturedImage || null,
        seoTitle: blogSeoTitle || blogTitle,
        seoDesc: blogSeoDesc || blogSummary || "",
      };

      const method = blogId ? "PUT" : "POST";
      const res = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setBlogEditorOpen(false);
        fetchBlogs();
      } else {
        alert(result.error || "Failed to save blog post.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error saving post.");
    } finally {
      setBlogLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (result.success) {
        fetchBlogs();
      } else {
        alert(result.error || "Failed to delete post.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error deleting post.");
    }
  };

  // Project CRUD handlers
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const result = await res.json();
      if (result.success) {
        setProjects(result.projects || []);
      }
    } catch (e) {
      console.error("Dashboard Projects fetch error:", e);
    }
  };

  const resetProjectForm = () => {
    setProjectId("");
    setProjectTitle("");
    setProjectSlug("");
    setProjectOverview("");
    setProjectFeatures("");
    setProjectChallenges("");
    setProjectArchitecture("");
    setProjectTechStack("");
    setProjectSchemaUrl("");
    setProjectApiFlow("");
    setProjectDeployment("");
    setProjectGallery([]);
    setProjectDemoVideo("");
    setProjectLiveUrl("");
    setProjectGithubUrl("");
    setProjectPerformance("");
    setProjectSeoTitle("");
    setProjectSeoDesc("");
  };

  const handleOpenProjectEditor = (proj?: any) => {
    if (proj) {
      setProjectId(proj.id);
      setProjectTitle(proj.title || "");
      setProjectSlug(proj.slug || "");
      setProjectOverview(proj.overview || "");
      setProjectFeatures(Array.isArray(proj.features) ? proj.features.join(", ") : "");
      setProjectChallenges(proj.challenges || "");
      setProjectArchitecture(proj.architecture || "");
      setProjectTechStack(Array.isArray(proj.techStack) ? proj.techStack.join(", ") : "");
      setProjectSchemaUrl(proj.schemaUrl || "");
      setProjectApiFlow(proj.apiFlow || "");
      setProjectDeployment(proj.deployment || "");
      setProjectGallery(Array.isArray(proj.gallery) ? proj.gallery : []);
      setProjectDemoVideo(proj.demoVideo || "");
      setProjectLiveUrl(proj.liveUrl || "");
      setProjectGithubUrl(proj.githubUrl || "");
      setProjectPerformance(proj.performance ?? "");
      setProjectSeoTitle(proj.seoTitle || "");
      setProjectSeoDesc(proj.seoDesc || "");
    } else {
      resetProjectForm();
    }
    setProjectEditorOpen(true);
  };

  const handleSaveProject = async () => {
    if (!projectTitle.trim() || !projectSlug.trim() || !projectOverview.trim()) {
      alert("Title, slug, and overview are required.");
      return;
    }
    setProjectLoading(true);
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const payload = {
        id: projectId || undefined,
        title: projectTitle,
        slug: projectSlug,
        overview: projectOverview,
        features: projectFeatures.split(",").map((s: string) => s.trim()).filter(Boolean),
        challenges: projectChallenges || null,
        architecture: projectArchitecture || null,
        techStack: projectTechStack.split(",").map((s: string) => s.trim()).filter(Boolean),
        schemaUrl: projectSchemaUrl || null,
        apiFlow: projectApiFlow || null,
        deployment: projectDeployment || null,
        gallery: projectGallery,
        demoVideo: projectDemoVideo || null,
        liveUrl: projectLiveUrl || null,
        githubUrl: projectGithubUrl || null,
        performance: projectPerformance || null,
        seoTitle: projectSeoTitle || projectTitle,
        seoDesc: projectSeoDesc || projectOverview,
      };

      const method = projectId ? "PUT" : "POST";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setProjectEditorOpen(false);
        resetProjectForm();
        fetchProjects();
      } else {
        alert(result.error || "Failed to save project.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error saving project.");
    } finally {
      setProjectLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchProjects();
        if (projectId === id) resetProjectForm();
      } else {
        alert(result.error || "Failed to delete project.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error deleting project.");
    }
  };

  const handleProjectGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setProjectImageUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const form = new FormData();
        form.append("image", files[i]);
        const res = await fetch("/api/admin/blogs/upload", { method: "POST", body: form });
        const result = await res.json();
        if (result.success && result.url) {
          setProjectGallery((prev) => [...prev, result.url]);
        }
      }
    } catch {
      alert("Network error uploading image.");
    } finally {
      setProjectImageUploading(false);
    }
  };

  const removeProjectGalleryImage = (index: number) => {
    setProjectGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Authenticate user check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  // Load dashboard records from unified database
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In Next.js, we can create api endpoints or read localdb directly.
      // Since it's a client page, we can hit helper endpoints or simulate load.
      // To bypass route handler lag, we fetch via standard local REST endpoints.
      const res = await fetch("/api/admin/data");
      const result = await res.json();
      if (result.success) {
        setLeads(result.leads || []);
        setCallbacks(result.callbacks || []);
        setMessages(result.messages || []);
        setSubscribers(result.subscribers || []);
        setVisitors(result.visitors || []);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch integrations config
  const fetchIntegrations = async () => {
    try {
      const res = await fetch("/api/admin/integrations");
      const result = await res.json();
      if (result.success && result.profile) {
        setName(result.profile.name || "");
        setBio(result.profile.bio || "");
        setRoles(result.profile.roles?.join(", ") || "");
        setGithub(result.profile.github || "");
        setLeetcode(result.profile.leetcode || "");
        setCodeforces(result.profile.codeforces || "");
        setCodechef(result.profile.codechef || "");
        setGeeksforgeeks(result.profile.geeksforgeeks || "");
        setHackerrank(result.profile.hackerrank || "");
        setAtcoder(result.profile.atcoder || "");
        setHackerearth(result.profile.hackerearth || "");
        setStackoverflow(result.profile.stackoverflow || "");
        setDevto(result.profile.devto || "");
        setKaggle(result.profile.kaggle || "");
        setCode360(result.profile.code360 || "");
        setInterviewbit(result.profile.interviewbit || "");
        setSyncLogs(result.syncLogs || []);
        setEnvStatus(result.envStatus || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveIntegrations = async (triggerSync: boolean, syncPlatform?: string) => {
    setSaveLoading(true);
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const rolesArray = roles.split(",").map(r => r.trim()).filter(Boolean);
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          roles: rolesArray,
          github,
          leetcode,
          codeforces,
          codechef,
          geeksforgeeks,
          hackerrank,
          atcoder,
          hackerearth,
          stackoverflow,
          devto,
          kaggle,
          code360,
          interviewbit,
          triggerSync,
          syncPlatform
        })
      });
      const result = await res.json();
      if (result.success) {
        alert(triggerSync ? "Account sync successfully executed!" : "Integrations successfully saved!");
        fetchIntegrations();
      } else {
        alert(result.error || "Failed to update configuration.");
      }
    } catch (e) {
      console.error(e);
      alert("Network connection error. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      const result = await res.json();
      if (result.success) {
        setExperiences(result.experiences || []);
      }
    } catch (e) {
      console.error("Dashboard Experience fetch error:", e);
    }
  };

  const handleSaveExperience = async () => {
    if (!expYear.trim() || !expTitle.trim() || !expDescription.trim()) {
      alert("Please fill in year, title, and description.");
      return;
    }
    setExpLoading(true);
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const method = expId ? "PUT" : "POST";
      const payload = expId 
        ? { id: expId, year: expYear, title: expTitle, description: expDescription, order: expOrder }
        : { year: expYear, title: expTitle, description: expDescription, order: expOrder };
      
      const res = await fetch("/api/admin/experience", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setExpYear("");
        setExpTitle("");
        setExpDescription("");
        setExpOrder(0);
        setExpId("");
        fetchExperiences();
      } else {
        alert(result.error || "Failed to save experience.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setExpLoading(false);
    }
  };

  const handleEditExperience = (exp: any) => {
    setExpId(exp.id);
    setExpYear(exp.year);
    setExpTitle(exp.title);
    setExpDescription(exp.description);
    setExpOrder(exp.order);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience timeline item?")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (result.success) {
        fetchExperiences();
        if (expId === id) {
          setExpYear("");
          setExpTitle("");
          setExpDescription("");
          setExpOrder(0);
          setExpId("");
        }
      } else {
        alert(result.error || "Failed to delete experience.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    }
  };

  const [faqs, setFaqs] = useState<any[]>([]);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqOrder, setFaqOrder] = useState(0);
  const [faqLoading, setFaqLoading] = useState(false);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faqs");
      const result = await res.json();
      if (result.success) {
        setFaqs(result.faqs || []);
      }
    } catch (e) {
      console.error("Dashboard FAQ fetch error:", e);
    }
  };

  const handleAddFaq = async () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert("Please fill in both question and answer.");
      return;
    }
    setFaqLoading(true);
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: faqQuestion,
          answer: faqAnswer,
          order: faqOrder
        })
      });
      const result = await res.json();
      if (result.success) {
        setFaqQuestion("");
        setFaqAnswer("");
        setFaqOrder(0);
        fetchFaqs();
      } else {
        alert(result.error || "Failed to add FAQ.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setFaqLoading(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch(`/api/faqs?id=${id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (result.success) {
        fetchFaqs();
      } else {
        alert(result.error || "Failed to delete FAQ.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadDashboardData();
      fetchIntegrations();
      fetchFaqs();
      fetchBlogs();
      fetchResume();
      fetchExperiences();
      fetchProjects();
    }
  }, [status]);

  // Update Status endpoints
  const updateStatus = async (type: "lead" | "callback" | "message", id: string, newStatus: string) => {
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status: newStatus }),
      });
      if (res.ok) {
        loadDashboardData(); // Refresh grid
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Record endpoints
  const deleteRecord = async (type: "lead" | "callback" | "message" | "subscriber", id: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return;
    if ((window as any).playClickSound) (window as any).playClickSound();
    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (res.ok) {
        loadDashboardData(); // Refresh grid
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CSV Export utility
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Guard access checks
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">
        Authenticating Secure Portal...
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center font-mono text-center p-8">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-xl text-white font-bold">Access Revoked</h2>
        <p className="text-zinc-500 text-xs mt-2 max-w-sm uppercase tracking-wider leading-relaxed">
          Your credentials do not hold the required ADMIN clearance nodes.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="mt-6 border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest cursor-pointer"
        >
          Logout Session
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // COMPUTED STATS & CHART DATA
  // -------------------------------------------------------------
  const totalVisits = visitors.length;
  const totalLeadsCount = leads.length;
  const totalCallbacksCount = callbacks.length;
  const totalMsgsCount = messages.length;

  // 1. Daily Visitor data logic
  const getVisitorChartData = () => {
    const datesMap: { [key: string]: number } = {};
    // Populate last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      datesMap[dateStr] = 0;
    }

    visitors.forEach((v) => {
      const dateStr = new Date(v.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (datesMap[dateStr] !== undefined) {
        datesMap[dateStr]++;
      }
    });

    return Object.entries(datesMap).map(([name, visits]) => ({ name, visits }));
  };

  // 2. Device count split logic
  const getDeviceChartData = () => {
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    visitors.forEach((v) => {
      if (v.device === "Mobile") devices.Mobile++;
      else if (v.device === "Tablet") devices.Tablet++;
      else devices.Desktop++;
    });
    return Object.entries(devices).map(([name, value]) => ({ name, value }));
  };

  // 3. Budget breakdowns logic
  const getBudgetChartData = () => {
    const budgets = { "Under $1k": 0, "$1k - $5k": 0, "$5k - $10k": 0, "$10k+": 0 };
    leads.forEach((l) => {
      if (l.budget?.includes("Under") || l.budget?.includes("1,000")) budgets["Under $1k"]++;
      else if (l.budget?.includes("5,000") && !l.budget?.includes("10,000")) budgets["$1k - $5k"]++;
      else if (l.budget?.includes("10,000")) budgets["$5k - $10k"]++;
      else budgets["$10k+"]++;
    });
    return Object.entries(budgets).map(([name, count]) => ({ name, count }));
  };

  const visitorChartData = getVisitorChartData();
  const deviceChartData = getDeviceChartData();
  const budgetChartData = getBudgetChartData();

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col font-sans select-none">
      {/* Header bar */}
      <header className="h-16 bg-zinc-950 border-b border-zinc-900 px-6 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Database className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Venom Dashboard</h1>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Administrator Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
            SECURE ADM: {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-900 p-4 select-none shrink-0 flex flex-col justify-between">
          <div className="space-y-1.5">
            {[
              { id: "overview", name: "Overview Analytics", icon: BarChart3 },
              { id: "leads", name: "Leads (Hire Me)", icon: Briefcase, count: totalLeadsCount },
              { id: "callbacks", name: "Callback Requests", icon: Calendar, count: totalCallbacksCount },
              { id: "messages", name: "Messages", icon: Mail, count: totalMsgsCount },
              { id: "subscribers", name: "Newsletter", icon: FileDown, count: subscribers.length },
              { id: "visitors", name: "Visitor Log", icon: Users, count: totalVisits },
              { id: "projects", name: "Projects Arsenal", icon: Package, count: projects.length },
              { id: "blogs", name: "Blog Ledger", icon: FileText, count: blogs.length },
              { id: "experience", name: "Timeline Manager", icon: Briefcase, count: experiences.length },
              { id: "integrations", name: "Integrations Sync", icon: Cpu },
              { id: "faqs", name: "FAQ Manager", icon: HelpCircle, count: faqs.length },
              { id: "resume", name: "Resume Upload", icon: Upload }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSel = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    isSel 
                      ? "bg-zinc-900 border border-zinc-800 text-cyan-400 shadow-md" 
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4.5 h-4.5" />
                    <span>{tab.name}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-zinc-900 border border-zinc-800 text-[10px] px-1.5 py-0.5 rounded-full text-zinc-400 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-900 mt-6 md:mt-0">
            <button
              onClick={() => {
                if ((window as any).playClickSound) (window as any).playClickSound();
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Content view grid */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar select-text bg-[#030303]">
          {loading ? (
            <div className="h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-600 animate-pulse">
              Retrieving database nodes...
            </div>
          ) : (
            <>
              {/* Tab 1: Overview Analytics dashboard */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: "Total Views", val: totalVisits, desc: "Unique page accesses", icon: Users, color: "text-emerald-400" },
                      { title: "Active Leads", val: totalLeadsCount, desc: "Hire Me pipeline", icon: Briefcase, color: "text-emerald-400" },
                      { title: "Callback Requests", val: totalCallbacksCount, desc: "Pending schedule bookings", icon: Calendar, color: "text-emerald-400" },
                      { title: "Subscriptions", val: subscribers.length, desc: "Newsletter alerts", icon: FileDown, color: "text-emerald-400" }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3 text-zinc-500">
                          <span className="text-[10px] font-mono uppercase tracking-widest">{card.title}</span>
                          <card.icon className="w-4.5 h-4.5 text-zinc-400" />
                        </div>
                        <div className="text-3xl font-extrabold text-white font-mono">{card.val}</div>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Charts sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visitor log line chart */}
                    <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                        7-Day Visitor Traffic
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={visitorChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                            <YAxis stroke="#52525b" fontSize={11} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                            <Line type="monotone" dataKey="visits" stroke="#00ff66" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Device distribution donut style bar chart */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                        Device Distribution
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={deviceChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                            <YAxis stroke="#52525b" fontSize={11} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                            <Bar dataKey="value" fill="#00ff66" radius={[4, 4, 0, 0]}>
                              {deviceChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#00ff66" : index === 1 ? "#3b82f6" : "#f59e0b"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Budget distribution bar chart */}
                    <div className="lg:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                        Lead Budget Distribution
                      </h3>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={budgetChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis type="number" stroke="#52525b" fontSize={11} allowDecimals={false} />
                            <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={11} width={80} />
                            <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "8px", fontSize: "12px", color: "#fff" }} />
                            <Bar dataKey="count" fill="#00ff66" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Leads List view */}
              {activeTab === "leads" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search leads by client name, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-white w-full"
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(leads, "lead_dossiers")}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Name</th>
                            <th className="p-4">Project Type</th>
                            <th className="p-4">Budget</th>
                            <th className="p-4">Timeline</th>
                            <th className="p-4">Requirements</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {leads
                            .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.email.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((l) => (
                              <tr key={l.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-white">{l.name}</div>
                                  <div className="text-[10px] text-zinc-500">{l.email}</div>
                                  <div className="text-[9px] text-zinc-600 italic mt-0.5">{l.company || "No Company"}</div>
                                </td>
                                <td className="p-4 text-emerald-400">{l.projectType}</td>
                                <td className="p-4 text-zinc-200">{l.budget}</td>
                                <td className="p-4">{l.timeline}</td>
                                <td className="p-4 max-w-[200px] truncate font-sans text-zinc-400" title={l.requirements}>
                                  {l.requirements || "No specifications"}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                    l.status === "PENDING" ? "bg-amber-950/20 border-amber-800 text-amber-400" : "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                                  }`}>
                                    {l.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {l.status === "PENDING" && (
                                    <button
                                      onClick={() => updateStatus("lead", l.id, "CONTACTED")}
                                      className="p-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 cursor-pointer"
                                      title="Mark Contacted"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteRecord("lead", l.id)}
                                    className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Callbacks List view */}
              {activeTab === "callbacks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search callbacks by client name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-white w-full"
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(callbacks, "callback_appointments")}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Client</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Preferred Time</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {callbacks
                            .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((c) => (
                              <tr key={c.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-white">{c.name}</div>
                                  <div className="text-[10px] text-zinc-500">{c.email}</div>
                                </td>
                                <td className="p-4 text-emerald-400 font-bold">{c.phone}</td>
                                <td className="p-4">{c.timeSlot}</td>
                                <td className="p-4 max-w-[200px] truncate font-sans text-zinc-400" title={c.message}>
                                  {c.message || "No comments"}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                    c.status === "PENDING" ? "bg-amber-950/20 border-amber-800 text-amber-400" : "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                                  }`}>
                                    {c.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {c.status === "PENDING" && (
                                    <button
                                      onClick={() => updateStatus("callback", c.id, "CALLED")}
                                      className="p-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-400 cursor-pointer"
                                      title="Mark Completed"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteRecord("callback", c.id)}
                                    className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Messages List view */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                    <Search className="w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search messages by sender name, subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs text-white w-full"
                    />
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Sender</th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Message Body</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {messages
                            .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((m) => (
                              <tr key={m.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                <td className="p-4 font-sans">
                                  <div className="font-bold text-white">{m.name}</div>
                                  <div className="text-[10px] text-zinc-500">{m.email}</div>
                                </td>
                                <td className="p-4 text-emerald-400 font-bold">{m.subject}</td>
                                <td className="p-4 font-sans text-zinc-400 max-w-xs break-words">
                                  {m.message}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                    m.status === "UNREAD" ? "bg-red-950/20 border-red-800 text-red-400 animate-pulse" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                  {m.status === "UNREAD" && (
                                    <button
                                      onClick={() => updateStatus("message", m.id, "READ")}
                                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-400 cursor-pointer"
                                      title="Mark Read"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteRecord("message", m.id)}
                                    className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Subscribers List view */}
              {activeTab === "subscribers" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-white w-full"
                      />
                    </div>
                    <button
                      onClick={() => exportToCSV(subscribers, "newsletter_subscribers")}
                      className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner max-w-xl">
                    <table className="w-full text-left text-xs font-mono select-text border-collapse">
                      <thead>
                        <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                          <th className="p-4">Email Address</th>
                          <th className="p-4">Subscribed Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {subscribers
                          .filter((s) => s.email.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((s) => (
                            <tr key={s.id} className="hover:bg-zinc-900/20 text-zinc-300">
                              <td className="p-4 text-white font-bold">{s.email}</td>
                              <td className="p-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => deleteRecord("subscriber", s.id)}
                                  className="p-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-400 cursor-pointer"
                                  title="Unsubscribe Client"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: Visitor Logs */}
              {activeTab === "visitors" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    Real-time Traffic Tracking
                  </h3>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono select-text border-collapse">
                        <thead>
                          <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">IP Address</th>
                            <th className="p-4">Device</th>
                            <th className="p-4">Platform OS</th>
                            <th className="p-4">Path Visited</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {visitors.slice(0, 100).map((v) => (
                            <tr key={v.id} className="hover:bg-zinc-900/10 text-zinc-400">
                              <td className="p-4 text-zinc-500">{new Date(v.createdAt).toLocaleString()}</td>
                              <td className="p-4 text-zinc-300">{v.ip}</td>
                              <td className={`p-4 font-bold ${
                                v.device === "Mobile" ? "text-blue-400" : v.device === "Tablet" ? "text-amber-400" : "text-emerald-400"
                              }`}>{v.device}</td>
                              <td className="p-4 font-sans text-zinc-300">{v.os} ({v.browser})</td>
                              <td className="p-4 text-emerald-500 font-bold">{v.path}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Integrations Sync Settings */}
              {activeTab === "integrations" && (
                <div className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                      Hero Profile & Sync Settings
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                      Configure your landing page Hero profile details and connect your public coding accounts to pull dynamic telemetry directly from database caches.
                    </p>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    {/* Hero Profile Metadata */}
                    <div className="border-b border-zinc-900 pb-6 mb-4 space-y-4">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] font-bold">Hero Profile Metadata</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Developer Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Hemant Raj"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Typewriter Roles (Comma separated)</label>
                        <input
                          type="text"
                          value={roles}
                          onChange={(e) => setRoles(e.target.value)}
                          placeholder="e.g. AI Engineer, Full Stack Developer"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Biography / About</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Describe your engineering focus..."
                          rows={4}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 font-sans resize-none"
                        />
                      </div>
                    </div>

                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] font-bold">Coding Platform Handles</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">GitHub Username</label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="e.g. HemantRaj-2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">LeetCode Username</label>
                      <input
                        type="text"
                        value={leetcode}
                        onChange={(e) => setLeetcode(e.target.value)}
                        placeholder="e.g. HemantRaj-2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Codeforces Handle</label>
                      <input
                        type="text"
                        value={codeforces}
                        onChange={(e) => setCodeforces(e.target.value)}
                        placeholder="e.g. HemantRaj-2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">CodeChef Handle</label>
                      <input
                        type="text"
                        value={codechef}
                        onChange={(e) => setCodechef(e.target.value)}
                        placeholder="e.g. hemant_2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">GeeksforGeeks Handle</label>
                      <input
                        type="text"
                        value={geeksforgeeks}
                        onChange={(e) => setGeeksforgeeks(e.target.value)}
                        placeholder="e.g. hemantraj2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">HackerRank Handle</label>
                      <input
                        type="text"
                        value={hackerrank}
                        onChange={(e) => setHackerrank(e.target.value)}
                        placeholder="e.g. hemant_2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">AtCoder Handle</label>
                      <input
                        type="text"
                        value={atcoder}
                        onChange={(e) => setAtcoder(e.target.value)}
                        placeholder="e.g. hemant_2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">HackerEarth Handle</label>
                      <input
                        type="text"
                        value={hackerearth}
                        onChange={(e) => setHackerearth(e.target.value)}
                        placeholder="e.g. hemant_2005"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">StackOverflow User ID</label>
                      <input
                        type="text"
                        value={stackoverflow}
                        onChange={(e) => setStackoverflow(e.target.value)}
                        placeholder="e.g. 12345678"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Dev.to Username</label>
                      <input
                        type="text"
                        value={devto}
                        onChange={(e) => setDevto(e.target.value)}
                        placeholder="e.g. hemantraj"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Kaggle Username</label>
                      <input
                        type="text"
                        value={kaggle}
                        onChange={(e) => setKaggle(e.target.value)}
                        placeholder="e.g. hemantraj"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">Code360 (Naukri) Username</label>
                      <input
                        type="text"
                        value={code360}
                        onChange={(e) => setCode360(e.target.value)}
                        placeholder="e.g. hemantraj"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1">InterviewBit Username</label>
                      <input
                        type="text"
                        value={interviewbit}
                        onChange={(e) => setInterviewbit(e.target.value)}
                        placeholder="e.g. hemantraj"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500/40 font-sans"
                      />
                    </div>

                    {envStatus && (
                      <div className="border border-zinc-900 rounded-xl p-4 space-y-2">
                        <h4 className="text-[10px] font-mono uppercase text-zinc-500">API Key Status</h4>
                        {[
                          { label: "GitHub Token", ok: envStatus.githubToken },
                          { label: "Gemini API Key", ok: envStatus.geminiKey },
                          { label: "StackExchange Key", ok: envStatus.stackexchangeKey },
                          { label: "Kaggle Keys", ok: envStatus.kaggleKeys },
                        ].map(({ label, ok }) => (
                          <div key={label} className="flex justify-between text-[10px] font-mono">
                            <span className="text-zinc-400">{label}</span>
                            <span className={ok ? "text-emerald-400" : "text-zinc-600"}>{ok ? "Configured" : "Not set"}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {syncLogs.length > 0 && (
                      <div className="border border-zinc-900 rounded-xl p-4 max-h-48 overflow-y-auto">
                        <h4 className="text-[10px] font-mono uppercase text-zinc-500 mb-3">Sync Logs</h4>
                        {syncLogs.slice(0, 20).map((log, i) => (
                          <div key={i} className="flex justify-between text-[9px] font-mono py-1 border-b border-zinc-900/50">
                            <span className="text-zinc-400">{log.platform}</span>
                            <span className={log.status === "success" ? "text-emerald-400" : "text-red-400"}>{log.status}</span>
                            <span className="text-zinc-600">{new Date(log.createdAt).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleSaveIntegrations(false)}
                        disabled={saveLoading}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-bold py-3.5 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs"
                      >
                        {saveLoading ? "Saving..." : "Save Config"}
                      </button>

                      <button
                        onClick={() => handleSaveIntegrations(true)}
                        disabled={saveLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white font-bold py-3.5 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${saveLoading ? "animate-spin" : ""}`} />
                        <span>{saveLoading ? "Syncing..." : "Sync All Platforms"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 11: Timeline Manager (Experience CRUD) */}
              {activeTab === "experience" && (
                <div className="space-y-8 max-w-4xl">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                      Timeline Experience Manager
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                      Manage experience timeline items displayed on the landing page.
                    </p>
                  </div>

                  {/* Add / Edit Form */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                      {expId ? "Modify Experience Item" : "Add New Experience Item"}
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Year / Period</label>
                          <input
                            type="text"
                            value={expYear}
                            onChange={(e) => setExpYear(e.target.value)}
                            placeholder="e.g. 2026 or 2025 - Present"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Display Order</label>
                          <input
                            type="number"
                            value={expOrder}
                            onChange={(e) => setExpOrder(parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Title / Role</label>
                        <input
                          type="text"
                          value={expTitle}
                          onChange={(e) => setExpTitle(e.target.value)}
                          placeholder="e.g. Senior Full Stack Engineer"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Description</label>
                        <textarea
                          value={expDescription}
                          onChange={(e) => setExpDescription(e.target.value)}
                          placeholder="e.g. Developed Next.js 15 apps and synchronized coding metadata dashboards."
                          rows={4}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveExperience}
                          disabled={expLoading}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs active:scale-95 disabled:opacity-50"
                        >
                          {expLoading ? "Saving..." : expId ? "Update Item" : "Add Experience"}
                        </button>
                        {expId && (
                          <button
                            onClick={() => {
                              setExpId("");
                              setExpYear("");
                              setExpTitle("");
                              setExpDescription("");
                              setExpOrder(0);
                            }}
                            className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 py-2.5 px-6 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* List existing Experience items */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">Existing Timeline Items ({experiences.length})</h4>
                    
                    {experiences.length === 0 ? (
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center text-zinc-650 font-mono text-xs uppercase tracking-widest">
                        No timeline records in database.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {experiences.map((exp) => (
                          <div key={exp.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="text-[#00E5FF] text-xs font-bold font-mono">{exp.year} - {exp.title}</div>
                              <p className="text-zinc-400 font-sans text-xs mt-1 leading-relaxed">{exp.description}</p>
                              <div className="text-[8px] font-mono text-zinc-650 uppercase tracking-wider mt-2">Display Order: {exp.order}</div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => handleEditExperience(exp)}
                                className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 border border-zinc-900 hover:border-cyan-950 bg-black/60 px-2 py-1 rounded transition-all uppercase tracking-wider cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteExperience(exp.id)}
                                className="text-[9px] font-mono text-red-500 hover:text-red-400 border border-zinc-900 hover:border-red-950 bg-black/60 px-2 py-1 rounded transition-all uppercase tracking-wider cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Projects Manager */}
              {activeTab === "projects" && (
                <div className="space-y-8">
                  {!projectEditorOpen ? (
                    <>
                      {/* Projects List */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-1">
                            Projects Arsenal Manager
                          </h3>
                          <p className="text-[11px] text-zinc-500 font-sans">
                            Manage portfolio projects. Each project gets its own dedicated page.
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenProjectEditor()}
                          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          New Project
                        </button>
                      </div>

                      {projects.length === 0 ? (
                        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                          No projects in database. Create your first project.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {projects.map((proj) => (
                            <div key={proj.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex gap-4">
                              {/* Thumbnail */}
                              {proj.gallery?.[0] && (
                                <img src={proj.gallery[0]} alt={proj.title} className="w-24 h-24 object-cover rounded-lg border border-zinc-800 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate">{proj.title}</h4>
                                    <p className="text-[10px] font-mono text-cyan-400 mt-0.5">/projects/{proj.slug}</p>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => handleOpenProjectEditor(proj)}
                                      className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 border border-zinc-800 hover:border-cyan-900 bg-black/60 px-2.5 py-1 rounded transition-all uppercase tracking-wider cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProject(proj.id)}
                                      className="text-[9px] font-mono text-red-500 hover:text-red-400 border border-zinc-800 hover:border-red-900 bg-black/60 px-2.5 py-1 rounded transition-all uppercase tracking-wider cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-zinc-500 mt-2 line-clamp-2 font-sans">{proj.overview}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {proj.techStack?.slice(0, 5).map((t: string) => (
                                    <span key={t} className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">{t}</span>
                                  ))}
                                  {proj.techStack?.length > 5 && (
                                    <span className="text-[9px] font-mono text-zinc-600">+{proj.techStack.length - 5}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                                  {proj.liveUrl && <span className="text-emerald-500">Live</span>}
                                  {proj.githubUrl && <span className="text-zinc-400">GitHub</span>}
                                  {proj.performance && <span className="text-amber-500">LHS: {proj.performance}</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Project Editor */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                          {projectId ? "Edit Project" : "Create New Project"}
                        </h3>
                        <button
                          onClick={() => { setProjectEditorOpen(false); resetProjectForm(); }}
                          className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-5">
                        {/* Basic Info */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border-b border-zinc-800/50 pb-2">Basic Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Project Title *</label>
                              <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Stark-Tech Spider OS" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">URL Slug *</label>
                              <input type="text" value={projectSlug} onChange={(e) => setProjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="stark-spider-os" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-mono" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Overview *</label>
                            <textarea value={projectOverview} onChange={(e) => setProjectOverview(e.target.value)} placeholder="A brief description of the project..." rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans resize-none" />
                          </div>
                        </div>

                        {/* Tech & Features */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border-b border-zinc-800/50 pb-2">Tech & Features</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Tech Stack (comma separated)</label>
                              <input type="text" value={projectTechStack} onChange={(e) => setProjectTechStack(e.target.value)} placeholder="Next.js, React, Prisma" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Performance Score (Lighthouse)</label>
                              <input type="number" min="0" max="100" value={projectPerformance} onChange={(e) => setProjectPerformance(e.target.value ? Number(e.target.value) : "")} placeholder="98" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-mono" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Features (comma separated)</label>
                            <input type="text" value={projectFeatures} onChange={(e) => setProjectFeatures(e.target.value)} placeholder="Real-time analysis, AI refactoring, CI/CD integration" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                          </div>
                        </div>

                        {/* Technical Details */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border-b border-zinc-800/50 pb-2">Technical Details</h4>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Challenges</label>
                            <textarea value={projectChallenges} onChange={(e) => setProjectChallenges(e.target.value)} placeholder="Engineering challenges faced..." rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans resize-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Architecture</label>
                            <textarea value={projectArchitecture} onChange={(e) => setProjectArchitecture(e.target.value)} placeholder="Architecture description..." rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans resize-none" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Schema / DB Info</label>
                              <input type="text" value={projectSchemaUrl} onChange={(e) => setProjectSchemaUrl(e.target.value)} placeholder="Prisma schema description" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">API Flow</label>
                              <input type="text" value={projectApiFlow} onChange={(e) => setProjectApiFlow(e.target.value)} placeholder="POST /api/analyze -> ..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Deployment</label>
                            <input type="text" value={projectDeployment} onChange={(e) => setProjectDeployment(e.target.value)} placeholder="Deployed on Vercel with serverless functions" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                          </div>
                        </div>

                        {/* Links */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border-b border-zinc-800/50 pb-2">Links & Media</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Live URL</label>
                              <input type="url" value={projectLiveUrl} onChange={(e) => setProjectLiveUrl(e.target.value)} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">GitHub URL</label>
                              <input type="url" value={projectGithubUrl} onChange={(e) => setProjectGithubUrl(e.target.value)} placeholder="https://github.com/..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Demo Video URL</label>
                            <input type="url" value={projectDemoVideo} onChange={(e) => setProjectDemoVideo(e.target.value)} placeholder="https://youtube.com/..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                          </div>

                          {/* Gallery Upload */}
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Gallery Images</label>
                            {projectGallery.length > 0 && (
                              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {projectGallery.map((url, i) => (
                                  <div key={i} className="relative group">
                                    <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover rounded-lg border border-zinc-800" />
                                    <button
                                      type="button"
                                      onClick={() => removeProjectGalleryImage(i)}
                                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <label className="flex items-center justify-center gap-2 w-full bg-zinc-900 border border-zinc-800 border-dashed rounded-xl px-3.5 py-6 text-xs text-zinc-500 cursor-pointer hover:border-cyan-500/40 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span>{projectImageUploading ? "Uploading..." : "Upload gallery images"}</span>
                              <input type="file" accept="image/*" multiple className="hidden" onChange={handleProjectGalleryUpload} disabled={projectImageUploading} />
                            </label>
                          </div>
                        </div>

                        {/* SEO */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border-b border-zinc-800/50 pb-2">SEO</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">SEO Title</label>
                              <input type="text" value={projectSeoTitle} onChange={(e) => setProjectSeoTitle(e.target.value)} placeholder="Defaults to project title" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">SEO Description</label>
                              <input type="text" value={projectSeoDesc} onChange={(e) => setProjectSeoDesc(e.target.value)} placeholder="Defaults to overview" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans" />
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleSaveProject}
                            disabled={projectLoading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-8 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs active:scale-95 disabled:opacity-50"
                          >
                            {projectLoading ? "Saving..." : projectId ? "Update Project" : "Create Project"}
                          </button>
                          <button
                            onClick={() => { setProjectEditorOpen(false); resetProjectForm(); }}
                            className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 py-2.5 px-6 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tab 8: FAQ Manager */}
              {activeTab === "faqs" && (
                <div className="space-y-8 max-w-4xl">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-4">
                      Security & Integration FAQ Manager
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                      Manage FAQs rendered dynamically on the portfolio landing page.
                    </p>
                  </div>

                  {/* Add FAQ Form */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">Add New FAQ Log</h4>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Question</label>
                        <input
                          type="text"
                          value={faqQuestion}
                          onChange={(e) => setFaqQuestion(e.target.value)}
                          placeholder="e.g. Is MongoDB setup required?"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Answer</label>
                        <textarea
                          value={faqAnswer}
                          onChange={(e) => setFaqAnswer(e.target.value)}
                          placeholder="e.g. No. If DATABASE_URL is missing, it falls back to local file storage."
                          rows={4}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-sans resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Display Order</label>
                        <input
                          type="number"
                          value={faqOrder}
                          onChange={(e) => setFaqOrder(parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-24 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-500/40 text-xs font-mono"
                        />
                      </div>
                      <button
                        onClick={handleAddFaq}
                        disabled={faqLoading}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs active:scale-95 disabled:opacity-50"
                      >
                        {faqLoading ? "Adding..." : "Add FAQ Entry"}
                      </button>
                    </div>
                  </div>

                  {/* List existing FAQs */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">Existing FAQ Entries ({faqs.length})</h4>
                    
                    {faqs.length === 0 ? (
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center text-zinc-650 font-mono text-xs uppercase tracking-widest">
                        No FAQ entries in database.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {faqs.map((faq) => (
                          <div key={faq.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="text-white text-xs font-bold font-mono">Q: {faq.question}</div>
                              <p className="text-zinc-500 font-sans text-xs">A: {faq.answer}</p>
                              <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider mt-1">Display Order: {faq.order}</div>
                            </div>
                            <button
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="text-[9px] font-mono text-red-500 hover:text-red-400 border border-zinc-900 hover:border-red-950 bg-black/60 px-2 py-1 rounded transition-all shrink-0 uppercase tracking-wider cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 9: Blog Ledger (Dynamic Block Editor) */}
              {activeTab === "blogs" && (
                <div className="space-y-6">
                  {blogEditorOpen ? (
                    // Editor Panel UI
                    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-3 select-none">
                        <div>
                          <h3 className="text-sm font-mono uppercase tracking-widest text-[#00E5FF]">
                            {blogId ? "Modify article coordinates" : "Create new article node"}
                          </h3>
                          <p className="text-[10px] text-zinc-550 font-mono mt-0.5 uppercase">
                            Dynamic Block editor synapsing active
                          </p>
                        </div>
                        <button
                          onClick={() => setBlogEditorOpen(false)}
                          className="text-xs font-mono text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-800 bg-black/60 px-3 py-1.5 rounded cursor-pointer transition-colors"
                        >
                          Back to Ledger
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Article Title</label>
                            <input
                              type="text"
                              value={blogTitle}
                              onChange={(e) => {
                                setBlogTitle(e.target.value);
                                if (!blogId) {
                                  setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                                }
                              }}
                              placeholder="e.g. Building 3D Canvas Portal rings"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-sans"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Slug (URL coordinate)</label>
                            <input
                              type="text"
                              value={blogSlug}
                              onChange={(e) => setBlogSlug(e.target.value)}
                              placeholder="e.g. building-3d-canvas-portal"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Category</label>
                              <input
                                type="text"
                                value={blogCategory}
                                onChange={(e) => setBlogCategory(e.target.value)}
                                placeholder="Development"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Read Time (min)</label>
                              <input
                                type="number"
                                value={blogReadTime}
                                onChange={(e) => setBlogReadTime(parseInt(e.target.value) || 5)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Tags (comma separated)</label>
                            <input
                              type="text"
                              value={blogTags}
                              onChange={(e) => setBlogTags(e.target.value)}
                              placeholder="WebGL, Three.js, React"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Summary (AI or manual description)</label>
                            <textarea
                              value={blogSummary}
                              onChange={(e) => setBlogSummary(e.target.value)}
                              placeholder="Describe the article essence in 1-2 sentences..."
                              rows={3}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-sans resize-none"
                            />
                          </div>

                          {/* Featured Image Upload */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Featured Image</label>
                            {blogFeaturedImage ? (
                              <div className="relative">
                                <img src={blogFeaturedImage} alt="Featured" className="w-full h-32 object-cover rounded-xl border border-zinc-800" />
                                <button
                                  type="button"
                                  onClick={() => setBlogFeaturedImage("")}
                                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white p-1 rounded-lg text-xs cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <label className="flex items-center justify-center gap-2 w-full bg-zinc-900 border border-zinc-800 border-dashed rounded-xl px-3.5 py-6 text-xs text-zinc-500 cursor-pointer hover:border-cyan-500/40 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span>{blogImageUploading ? "Uploading..." : "Upload image"}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleBlogImageUpload} disabled={blogImageUploading} />
                              </label>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-2 select-none">
                            <input
                              type="checkbox"
                              id="blogPublished"
                              checked={blogPublished}
                              onChange={(e) => setBlogPublished(e.target.checked)}
                              className="rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-0 w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor="blogPublished" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest cursor-pointer pl-1">
                              Deploy live payload (Published)
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* SEO Coordinates details */}
                      <div className="border-t border-zinc-900 pt-4 space-y-4">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">SEO Coordinates (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Meta Title</label>
                            <input
                              type="text"
                              value={blogSeoTitle}
                              onChange={(e) => setBlogSeoTitle(e.target.value)}
                              placeholder="SEO search result header"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Meta Description</label>
                            <input
                              type="text"
                              value={blogSeoDesc}
                              onChange={(e) => setBlogSeoDesc(e.target.value)}
                              placeholder="SEO snippet text"
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Blocks Section */}
                      <div className="border-t border-zinc-900 pt-6 space-y-4">
                        <div className="flex justify-between items-center select-none">
                          <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#00E5FF]">Dynamic Block Sequence</h4>
                          <span className="text-[9px] font-mono text-zinc-550 uppercase">Blocks count: {blogBlocks.length}</span>
                        </div>

                        {blogBlocks.length === 0 ? (
                          <div className="border border-dashed border-zinc-800 bg-zinc-950/20 p-8 rounded-xl text-center text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                            Block stack empty. Append a new coordinate layer below.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {blogBlocks.map((block, idx) => (
                              <div key={idx} className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 space-y-3 relative group/block">
                                <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-2 select-none">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-mono text-[#00E5FF] bg-cyan-950/20 border border-cyan-800/10 px-2 py-0.5 rounded uppercase">
                                      Block #{idx + 1}: {block.type}
                                    </span>
                                    {block.type === "header" && (
                                      <div className="flex gap-1">
                                        {[1, 2, 3].map(lvl => (
                                          <button
                                            key={lvl}
                                            onClick={() => updateBlogBlock(idx, { level: lvl })}
                                            className={`text-[8px] font-mono px-1.5 py-0.5 rounded border cursor-pointer ${
                                              block.level === lvl 
                                                ? "bg-cyan-500 text-black border-cyan-400" 
                                                : "bg-black/40 border-zinc-800 text-zinc-500"
                                            }`}
                                          >
                                            H{lvl}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                    {block.type === "callout" && (
                                      <div className="flex gap-1">
                                        {["info", "success", "warning"].map(type => (
                                          <button
                                            key={type}
                                            onClick={() => updateBlogBlock(idx, { calloutType: type })}
                                            className={`text-[8px] font-mono px-1.5 py-0.5 rounded border cursor-pointer uppercase ${
                                              block.calloutType === type 
                                                ? type === "warning" ? "bg-amber-500 text-black border-amber-400" : type === "success" ? "bg-emerald-500 text-black border-emerald-400" : "bg-cyan-500 text-black border-cyan-400"
                                                : "bg-black/40 border-zinc-800 text-zinc-500"
                                            }`}
                                          >
                                            {type}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 opacity-45 group-hover/block:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => moveBlogBlock(idx, "up")}
                                      disabled={idx === 0}
                                      className="p-1 rounded bg-black/40 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                      title="Move Up"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => moveBlogBlock(idx, "down")}
                                      disabled={idx === blogBlocks.length - 1}
                                      className="p-1 rounded bg-black/40 border border-zinc-850 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                      title="Move Down"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => deleteBlogBlock(idx)}
                                      className="p-1 rounded bg-red-955/20 border border-red-900/20 text-red-400 hover:bg-red-900/40 cursor-pointer"
                                      title="Delete Block"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Render Block Specific Input Fields */}
                                {block.type === "header" && (
                                  <input
                                    type="text"
                                    value={block.content}
                                    onChange={(e) => updateBlogBlock(idx, { content: e.target.value })}
                                    placeholder="Header content text..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/20 font-sans"
                                  />
                                )}

                                {(block.type === "paragraph" || block.type === "quote" || block.type === "callout") && (
                                  <textarea
                                    value={block.content}
                                    onChange={(e) => updateBlogBlock(idx, { content: e.target.value })}
                                    placeholder={block.type === "paragraph" ? "Paragraph markdown rich content..." : block.type === "quote" ? "Quote body text..." : "Callout notification message..."}
                                    rows={block.type === "paragraph" ? 5 : 3}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/20 font-sans resize-none"
                                  />
                                )}

                                {block.type === "code" && (
                                  <div className="space-y-2">
                                    <div className="flex gap-4">
                                      <div className="flex-1 space-y-1">
                                        <label className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Syntax Language</label>
                                        <input
                                          type="text"
                                          value={block.language || ""}
                                          onChange={(e) => updateBlogBlock(idx, { language: e.target.value })}
                                          placeholder="typescript, glsl, rust, python..."
                                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500/20 font-mono"
                                        />
                                      </div>
                                    </div>
                                    <textarea
                                      value={block.content}
                                      onChange={(e) => updateBlogBlock(idx, { content: e.target.value })}
                                      placeholder="Paste raw block code script..."
                                      rows={6}
                                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 outline-none focus:border-cyan-500/20 font-mono resize-none leading-relaxed"
                                    />
                                  </div>
                                )}

                                {block.type === "image" && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest pl-1">Image URL</label>
                                      <input
                                        type="text"
                                        value={block.url}
                                        onChange={(e) => updateBlogBlock(idx, { url: e.target.value })}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/20 font-mono"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest pl-1">Caption / Alt Description</label>
                                      <input
                                        type="text"
                                        value={block.caption}
                                        onChange={(e) => updateBlogBlock(idx, { caption: e.target.value })}
                                        placeholder="Torus mesh shader portal simulation"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500/20 font-sans"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Blocks Action Hub */}
                        <div className="border border-zinc-900 bg-zinc-950/40 p-4 rounded-2xl flex flex-wrap gap-2.5 items-center justify-center select-none">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider pr-1">Append new block:</span>
                          <button
                            onClick={() => addBlogBlock("header")}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Header
                          </button>
                          <button
                            onClick={() => addBlogBlock("paragraph")}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Paragraph
                          </button>
                          <button
                            onClick={() => addBlogBlock("code")}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Code Block
                          </button>
                          <button
                            onClick={() => addBlogBlock("quote")}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Quote
                          </button>
                          <button
                            onClick={() => addBlogBlock("callout")}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Callout
                          </button>
                          <button
                            onClick={() => addBlogBlock("image")}
                            className="flex items-center gap-1.5 border border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Image
                          </button>
                        </div>
                      </div>

                      {/* Main Save / Cancel Trigger button bar */}
                      <div className="flex gap-4 pt-4 border-t border-zinc-900 select-none">
                        <button
                          onClick={() => setBlogEditorOpen(false)}
                          className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white font-bold py-3 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs"
                        >
                          Cancel / Discard Changes
                        </button>
                        <button
                          onClick={handleSaveBlog}
                          disabled={blogLoading}
                          className="flex-1 bg-[#E11D2E] hover:bg-[#c81a28] disabled:bg-zinc-850 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs"
                        >
                          {blogLoading ? "Saving Article payload..." : "Save and Deploy Article"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Articles List UI
                    <div className="space-y-4">
                      <div className="flex justify-between items-center select-none">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 w-full max-w-sm">
                          <Search className="w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Search articles by title, tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs text-white w-full"
                          />
                        </div>
                        <button
                          onClick={() => handleOpenBlogEditor()}
                          className="bg-[#E11D2E] hover:bg-[#c81a28] text-white text-xs font-mono uppercase tracking-wider py-2.5 px-4 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create New Article</span>
                        </button>
                      </div>

                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-inner">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono select-text border-collapse">
                            <thead>
                              <tr className="bg-zinc-900/60 text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                                <th className="p-4">Title & Slug</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4">Read Time</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                              {blogs
                                .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.slug.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((b) => (
                                  <tr key={b.id} className="hover:bg-zinc-900/20 text-zinc-300">
                                    <td className="p-4 font-sans max-w-xs">
                                      <div className="font-bold text-white leading-snug">{b.title}</div>
                                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5 font-semibold">/{b.slug}</div>
                                      <div className="text-[9px] text-zinc-600 font-mono mt-0.5">Created: {new Date(b.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 text-[#00E5FF]">{b.category || "Development"}</td>
                                    <td className="p-4 max-w-[150px] truncate" title={b.tags?.join(", ")}>
                                      {b.tags?.map((t: string) => `#${t}`).join(" ") || "None"}
                                    </td>
                                    <td className="p-4">{b.readTime || 5} min</td>
                                    <td className="p-4">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold border ${
                                        b.published ? "bg-emerald-950/20 border-emerald-800 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-450"
                                      }`}>
                                        {b.published ? "LIVE" : "DRAFT"}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                      <button
                                        onClick={() => handleOpenBlogEditor(b)}
                                        className="text-[9px] px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-400 hover:text-white cursor-pointer uppercase transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteBlog(b.id)}
                                        className="text-[9px] px-2 py-1 rounded bg-red-950/20 hover:bg-red-900/40 border border-red-900/20 text-red-400 cursor-pointer uppercase transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              {blogs.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-zinc-650 uppercase tracking-widest font-mono">
                                    No articles logged in ledger.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 10: Resume Upload */}
              {activeTab === "resume" && (
                <div className="space-y-8 max-w-2xl">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 border-b border-zinc-900 pb-3 mb-2">
                      Resume Asset Manager
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                      Upload a PDF resume. It will be publicly accessible on the portfolio for download and will appear on the Dev Stats section.
                    </p>
                  </div>

                  {/* Current Resume Status */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">Current Resume Status</h4>
                    {currentResumeUrl ? (
                      <div className="flex items-center justify-between bg-emerald-950/10 border border-emerald-900/30 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-xs font-mono text-emerald-400 font-bold">Resume Active</p>
                            <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{currentResumeUrl}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={currentResumeUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-mono uppercase tracking-widest border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Download className="w-3 h-3" /> Preview
                          </a>
                          <button
                            onClick={handleDeleteResume}
                            className="text-[9px] font-mono uppercase tracking-widest border border-red-900/30 bg-red-950/20 hover:bg-red-900/40 text-red-400 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
                        <AlertCircle className="w-5 h-5 text-zinc-500 shrink-0" />
                        <div>
                          <p className="text-xs font-mono text-zinc-400">No Resume Uploaded</p>
                          <p className="text-[10px] font-mono text-zinc-600 mt-0.5">Upload a PDF below to make it publicly available.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload New Resume */}
                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-5">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">Upload New Resume</h4>

                    {/* Drop / Click Zone */}
                    <label
                      htmlFor="resumeFileInput"
                      className={`block w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                        resumeFile
                          ? "border-emerald-600/50 bg-emerald-950/10"
                          : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/20 hover:bg-zinc-900/40"
                      }`}
                    >
                      {resumeFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileCheck className="w-10 h-10 text-emerald-400" />
                          <p className="text-sm font-bold text-white">{resumeFile.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">
                            {(resumeFile.size / 1024).toFixed(1)} KB — PDF Ready to Upload
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <Upload className="w-10 h-10 text-zinc-600" />
                          <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Click to select PDF</p>
                          <p className="text-[10px] font-mono text-zinc-600">Max file size: 10 MB · PDF only</p>
                        </div>
                      )}
                      <input
                        id="resumeFileInput"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null;
                          setResumeFile(f);
                          setResumeUploadStatus("idle");
                          setResumeUploadMessage("");
                        }}
                      />
                    </label>

                    {/* Status feedback */}
                    {resumeUploadStatus !== "idle" && (
                      <div className={`flex items-center gap-2 text-[10px] font-mono rounded-lg px-3 py-2 ${
                        resumeUploadStatus === "success"
                          ? "bg-emerald-950/20 border border-emerald-900/30 text-emerald-400"
                          : "bg-red-950/20 border border-red-900/30 text-red-400"
                      }`}>
                        {resumeUploadStatus === "success"
                          ? <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                        <span>{resumeUploadMessage}</span>
                      </div>
                    )}

                    <button
                      onClick={handleUploadResume}
                      disabled={resumeUploading || !resumeFile}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-3.5 rounded-xl cursor-pointer transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                    >
                      {resumeUploading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> Deploy Resume to Portfolio</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
