import Image from "next/image";
import Link from "next/link";

export default function Documentation() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-3xl w-full">
        <Link href="/">
          <Image
            className="dark:invert hover:opacity-80 transition-opacity cursor-pointer"
            src="/vibe_project_logo.png"
            alt="vibe logo"
            width={180}
            height={38}
            priority
          />
        </Link>
        
        <div className="bg-white rounded-2xl shadow-md p-8 w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">Vibe Documentation</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">About Vibe</h2>
            <p className="text-gray-700 mb-4">
              Vibe is a comprehensive API management platform that allows you to create, manage, and monitor your API keys.
              With Vibe, you can easily track usage, set quotas, and ensure the security of your API infrastructure.
            </p>
            <p className="text-gray-700 mb-4">
              Our platform is designed for developers who need robust API key management with minimal setup and maintenance.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Create and manage multiple API keys with custom names</li>
              <li>Monitor API usage through intuitive dashboards</li>
              <li>Set permissions and access controls for each key</li>
              <li>Track usage metrics and identify patterns</li>
              <li>Secure authentication with Google Sign-in</li>
              <li>Test API keys directly from the dashboard</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>
                <strong>Create an account</strong>
                <p className="mt-1">Sign in with your Google account to get started with Vibe.</p>
              </li>
              <li>
                <strong>Generate your first API key</strong>
                <p className="mt-1">Navigate to the API Keys dashboard and create your first key.</p>
              </li>
              <li>
                <strong>Integrate with your application</strong>
                <p className="mt-1">Use the provided code snippets to integrate your API key into your application.</p>
              </li>
              <li>
                <strong>Monitor usage</strong>
                <p className="mt-1">Track your API usage through the Overview dashboard.</p>
              </li>
            </ol>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Resources</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/playground"
                  className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-200 text-blue-600 hover:bg-gray-50 transition-colors flex-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  Try API Playground
                </Link>
                <Link 
                  href="/overview"
                  className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg border border-gray-200 text-blue-600 hover:bg-gray-50 transition-colors flex-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Vibe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
