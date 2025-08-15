import React from 'react'

const Page = ()  => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/5 p-10">
          {/* Accent blob */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-200/60 blur-3xl" />

          

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Coming <span className="text-indigo-600">Soon</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            We’re busy crafting something awesome. Stay tuned!
          </p>

         

          {/* Footnote */}
          <div className="mt-8 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              We’re in active development
            </span>
          </div>
        </div>

        
      </div>
    </main>
  );
}


export default Page