"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewVentureIdeaPage() {
  const router = useRouter();
  return (
    <div className="px-gutter py-space-lg">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-space-xl">
          <Link href="/ventures/new" className="p-2 rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-navy-deep">Describe Your Idea</h1>
        </div>
        <div className="bg-surface-pure rounded-2xl shadow-sm p-space-xl">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">Provide more context for your venture idea.</p>
          <button onClick={() => router.push("/ventures/new")} className="inline-flex items-center gap-2 h-11 px-6 bg-navy-deep text-on-primary font-label-md text-label-md rounded-xl">
            Back to Venture Setup
          </button>
        </div>
      </div>
    </div>
  );
}
