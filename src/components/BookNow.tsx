"use client";

import { Calendar } from "lucide-react";

export function BookNow({ contractorCalLink }: { contractorCalLink?: string }) {
  const calLink = contractorCalLink || "https://cal.com/coremind/roofing-consult";

  return (
    <a
      href={calLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
    >
      <Calendar className="w-5 h-5" />
      Book Estimate Now
    </a>
  );
}
