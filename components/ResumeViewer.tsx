"use client";

import React from "react";
import { X, Download, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeViewerProps {
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeViewer({ url, isOpen, onClose }: ResumeViewerProps) {
  if (!url) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl h-[85vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950/95 shrink-0">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                Resume Dossier
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#00E5FF] border border-cyan-800/30 bg-cyan-950/20 hover:bg-cyan-950/40 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Maximize2 className="w-3 h-3" />
                  Full Screen
                </a>
                <a
                  href={url}
                  download
                  className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400 border border-emerald-800/30 bg-emerald-950/20 hover:bg-emerald-950/40 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-zinc-900">
              <iframe
                src={`${url}#toolbar=0&navpanes=0`}
                className="w-full h-full border-0"
                title="Resume PDF Viewer"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
