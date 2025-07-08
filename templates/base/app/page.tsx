import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to your 4n Stack App 🚀
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              This project is powered by Next.js, Better Auth, and Drizzle ORM.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Next.js Card */}
            <Link href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-600 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Next.js</h3>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-gray-300 text-left">
                  The React framework for production with built-in optimization, routing, and full-stack capabilities.
                </p>
              </div>
            </Link>

            {/* Better Auth Card */}
            <Link href="https://www.better-auth.com" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-600 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Better Auth</h3>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-gray-300 text-left">
                  A comprehensive authentication library with built-in security features and flexible configuration
                  options.
                </p>
              </div>
            </Link>

            {/* Drizzle ORM Card */}
            <Link href="https://orm.drizzle.team" target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-700/50 hover:border-gray-600 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Drizzle ORM</h3>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-gray-300 text-left">
                  A lightweight TypeScript ORM with excellent developer experience and type safety for SQL databases.
                </p>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-sm">
              Get started by editing{" "}
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-300 font-mono text-xs">app/page.tsx</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
