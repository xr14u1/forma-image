import React from 'react';
import { FileText, Shield } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Terms of Use
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Last updated: October 2026. Terms governing the use of Forma Studio.
        </p>
      </div>

      <div className="space-y-8 text-sm text-zinc-600 dark:text-zinc-300">
        
        <section className="space-y-2">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            1. Acceptance of Terms
          </h3>
          <p className="leading-relaxed">
            By accessing or using Forma, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            2. License & Intellectual Property
          </h3>
          <p className="leading-relaxed">
            All images, graphics, and files processed through Forma remain 100% your property. Forma claims no ownership, copyright, or rights over the content you manipulate using our client-side tools.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            3. Disclaimer of Warranty
          </h3>
          <p className="leading-relaxed">
            Forma is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not warrant that the service will be error-free or uninterrupted.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            4. Limitation of Liability
          </h3>
          <p className="leading-relaxed">
            In no event shall Forma or its creators be liable for any indirect, incidental, special, or consequential damages resulting from the use of the platform.
          </p>
        </section>

      </div>

    </div>
  );
};
