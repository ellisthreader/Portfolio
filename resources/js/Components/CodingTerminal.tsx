import React, { useState, useEffect, useRef } from "react";

// Code typed at the prompt
const codeLines = [
  "const hello = 'world';",
  "function greet(name) {",
  "  return `Hello!`;",
  "}",
  "console.log(greet(hello));",
];

// Output shown after typing finishes
const outputLines = [
"Hello!",
  "⠀⠀⠀⠀⣀⡤⠴⠶⠲⠦⢤⣀⠀⠀⠀⠀⠀",
  "⠀⠀⢠⠞⠉⠀⠀⠀⠀⠀⠀⠉⠳⡄⠀⠀⠀",
  "⠀⢠⠏⠀⠀⣤⡄⠀⠀⢠⣤⠀⠀⠹⡆⠀⠀",
  "⠀⣾⠀⠀⠀⠉⠁⠀⠀⠈⠉⠀⠀⠀⣷⠀⠀",
  "⠀⢻⠀⠀⠘⣆⠀⠀⠀⠀⣰⠇⠀⠀⡟⠀⠀",
  "⠀⠘⣧⠀⠀⠈⠓⠶⠴⠚⠁⠀⠀⣰⠃⠀⠀",
  "⠀⠀⠈⠳⣄⡀⠀⠀⠀⠀⢀⣠⠞⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠉⠛⠒⠒⠚⠉⠁⠀⠀⠀⠀",
];

export default function CodingTerminal() {
  const [visibleChars, setVisibleChars] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  const totalChars = codeLines.join("\n").length;

  // Scroll-driven typing
  useEffect(() => {
    const SCROLL_SPEED = 2.5; // typing speed
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress 0 → 1 as the section enters viewport
      let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      progress = Math.min(1, Math.max(0, progress));

      const chars = Math.floor(progress * SCROLL_SPEED * totalChars);
      setVisibleChars(chars);

      // Show output only after all code typed
      setShowOutput(chars >= totalChars);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalChars]);

  // Build typed code at the prompt
  let accumulatedChars = 0;
  const typedCode = codeLines
    .map(line => {
      if (accumulatedChars + line.length + 1 <= visibleChars) {
        accumulatedChars += line.length + 1;
        return line;
      } else if (accumulatedChars < visibleChars) {
        const remaining = visibleChars - accumulatedChars;
        accumulatedChars += remaining;
        return line.slice(0, remaining);
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");

  return (
    <div
      ref={containerRef}
      className="bg-black font-mono p-6 rounded-lg w-full max-w-3xl shadow-lg relative"
      style={{ minHeight: "450px" }}
    >
      {/* Terminal top bar */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gray-800 rounded-t-lg flex items-center px-3 text-sm text-gray-200">
        $ Terminal
      </div>

      <div className="pt-8">
        {/* Terminal prompt */}
        <div className="mb-2 text-sm">
          <span className="text-green-400">ellis@ellis-Z270P-D3</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~/Desktop/PortfolioWebsite</span>
          <span className="text-white">$ </span>
          <span className="text-white">{typedCode}</span>
          {/* Blinking cursor */}
          <span
            className={`inline-block w-1 ${cursorVisible ? "bg-white" : "bg-transparent"}`}
          >
            &nbsp;
          </span>
        </div>

        {/* Output after code typed */}
        {showOutput && (
          <pre className="whitespace-pre-wrap leading-relaxed text-white mt-2 text-lg">
            {outputLines.join("\n")}
          </pre>
        )}
      </div>
    </div>
  );
}
