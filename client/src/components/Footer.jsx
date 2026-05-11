import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-400">
        <p>Built with React + Node.js + MongoDB</p>
        <div className="flex items-center gap-2">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-md p-1 hover:text-white">
            <Github size={14} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-md p-1 hover:text-white">
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
