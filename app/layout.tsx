import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "../components/ConvexClientProvider";
import Link from "next/link";
import { LayoutDashboard, Brain, Calendar, Users, Briefcase } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mission Control",
  description: "OpenClaw Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <ConvexClientProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r fixed h-full">
              <div className="p-6 border-b">
                <h1 className="text-xl font-bold text-gray-800">🚀 Mission Control</h1>
                <p className="text-xs text-gray-500 mt-1">OpenClaw OS</p>
              </div>
              <nav className="p-4 space-y-2">
                <Link href="/tasks" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                  <LayoutDashboard size={20} /> Tasks
                </Link>
                <Link href="/memory" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                  <Brain size={20} /> Memory
                </Link>
                <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                  <Calendar size={20} /> Calendar
                </Link>
                <Link href="/team" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                  <Users size={20} /> Team
                </Link>
                <Link href="/office" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                  <Briefcase size={20} /> Office
                </Link>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
              {children}
            </main>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
