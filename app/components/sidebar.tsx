import React from "react";
import Link from "next/link";

const navLinks = [
  { name: "Overview", href: "/overview", icon: "🏠" },
  { name: "API Playground", href: "/playground", icon: "🧪" },
  { name: "Manage API Keys", href: "/dashboards", icon: "🔑" },
  { name: "Use Cases", href: "/use-cases", icon: "💡" },
  { name: "Billing", href: "/billing", icon: "💳" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

const externalLinks = [
  { name: "Documentation", href: "https://docs.example.com", icon: "📄" },
  { name: "Vibe MCP", href: "https://mcp.example.com", icon: "🌐" },
];

export default function Sidebar({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <aside
      className={`
        h-screen w-64 bg-white border-r border-gray-100 flex flex-col py-6 px-4 shadow-sm
        fixed top-0 left-0 z-40 transition-transform duration-300
        ${visible ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{ minHeight: "100vh" }}
    >
      {/* Close button (visible on mobile/small screens) */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        ×
      </button>
      {/* Logo */}
      <div className="flex items-center mb-8 px-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        <span className="font-bold text-xl tracking-tight text-gray-800">vibe</span>
      </div>

      {/* User Dropdown/Profile */}
      <div className="flex items-center mb-8 px-2">
        <img
          src="/avatar.png"
          alt="User"
          className="h-8 w-8 rounded-full mr-2 border border-gray-200"
        />
        <select className="bg-gray-100 rounded px-2 py-1 text-sm text-gray-700">
          <option>Personal</option>
          {/* Add more options if needed */}
        </select>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition
                  font-medium
                `}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <ul className="space-y-1">
            {externalLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.name}
                  <svg
                    className="ml-2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7m5-5 3 3m0 0-3 3m3-3H10"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
