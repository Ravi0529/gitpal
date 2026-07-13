"use client";

import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import "streamdown/styles.css";

export function AiReviewMarkdown({ review }: { review: string }) {
  return (
    <Streamdown plugins={{ code }} className="text-sm leading-relaxed">
      {review}
    </Streamdown>
  );
}
