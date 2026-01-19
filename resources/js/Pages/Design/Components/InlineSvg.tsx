"use client";

import React, { useEffect, useState } from "react";

type Props = {
  src: string;
  color?: string;
};

export default function InlineSvg({ src, color = "#000000" }: Props) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(text => {
        // 1️⃣ Remove all embedded styles
        let cleaned = text
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/fill="none"/gi, "")
          .replace(/stroke="none"/gi, "");

        // 2️⃣ Force SVG to inherit color
        cleaned = cleaned.replace(
          /<svg([^>]*)>/i,
          `<svg$1 style="color:${color}; fill:currentColor; stroke:currentColor;" width="100%" height="100%">`
        );

        setSvg(cleaned);
      });
  }, [src, color]);

  return (
    <div
      className="w-full h-full pointer-events-none"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
