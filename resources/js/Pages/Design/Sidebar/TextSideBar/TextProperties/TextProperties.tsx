"use client";

import React, { useState, useRef, useLayoutEffect } from "react";

import TextArea from "./TextArea";
import FontSelector from "./FontSelector";
import FontPage from "./FontPage";
import ColorPicker from "./ColorPicker";
import RangeSlider from "./RangeSlider";
import OutlineProperties from "./OutlineProperties";
import OutlinePage from "./OutlinePage";

import { RotateCw, Square } from "lucide-react";

type Props = {
  textValue: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  rotation: number;
  borderWidth: number;
  borderColor: string;

  onTextChange: (v: string) => void;
  onFontChange: (v: string) => void;
  onFontSizeChange: (v: number) => void;
  onColorChange: (v: string) => void;
  onRotationChange: (v: number) => void;
  onBorderWidthChange: (v: number) => void;
  onBorderColorChange: (v: string) => void;

  restrictedBox: { width: number; height: number }; // ⚡ REQUIRED for max font size
};

export default function TextProperties(props: Props) {
  const [panel, setPanel] = useState<"main" | "fonts" | "outline">("main");
  const measureRef = useRef<HTMLSpanElement>(null);
  const [maxFontSize, setMaxFontSize] = useState(150);

  // ---- Fonts panel ----
  if (panel === "fonts") {
    return (
      <div className="p-6">
        <FontPage
          fontFamily={props.fontFamily}
          textValue={props.textValue}
          onFontChange={props.onFontChange}
          onBack={() => setPanel("main")}
        />
      </div>
    );
  }

  // ---- Outline panel ----
  if (panel === "outline") {
    return (
      <div className="p-6">
        <OutlinePage
          borderColor={props.borderColor}
          onBorderColorChange={props.onBorderColorChange}
          borderWidth={props.borderWidth}
          onBorderWidthChange={props.onBorderWidthChange}
          onBack={() => setPanel("main")}
        />
      </div>
    );
  }

  // ---- Compute max font size dynamically ----
  useLayoutEffect(() => {
    if (!measureRef.current || !props.restrictedBox) return;

    const span = measureRef.current;

    // temporarily set text size to 1px
    span.style.fontSize = "1px";

    const rect = span.getBoundingClientRect();
    const textWidth = rect.width + props.borderWidth * 2;
    const textHeight = rect.height + props.borderWidth * 2;

    if (textWidth === 0 || textHeight === 0) return;

    const widthLimit = props.restrictedBox.width / textWidth;
    const heightLimit = props.restrictedBox.height / textHeight;

    const newMax = Math.floor(Math.min(widthLimit, heightLimit, 150));

    // 👉 Log when text is touching / filling the restricted box
    if (newMax <= props.fontSize) {
      console.log(
        "[TEXT] Touching restricted box:",
        {
          restrictedBox: props.restrictedBox,
          newMax,
          currentFontSize: props.fontSize
        }
      );
    }

    setMaxFontSize(newMax);

    // 👉 Auto shrink if too big (and log when it shrinks)
    if (props.fontSize > newMax) {
      console.log(
        "[TEXT] Shrinking text:",
        {
          from: props.fontSize,
          to: newMax
        }
      );

      props.onFontSizeChange(newMax);
    }

  }, [
    props.textValue,
    props.fontFamily,
    props.borderWidth,
    props.restrictedBox,
    props.fontSize
  ]);


  // ---- Main panel ----
  return (
    <div className="space-y-10 p-6">
      <TextArea
        textValue={props.textValue}
        onTextChange={props.onTextChange}
      />

      <FontSelector
        fontFamily={props.fontFamily}
        onOpenFonts={() => setPanel("fonts")}
      />

      <ColorPicker
        color={props.color}
        onColorChange={props.onColorChange}
      />

      <RangeSlider
        label="Rotation"
        min={-180}
        max={180}
        value={props.rotation}
        onChange={props.onRotationChange}
        icon={<RotateCw size={20} />}
      />

      <RangeSlider
        label="Text Size"
        min={8}
        max={maxFontSize} // ⚡ dynamically capped
        value={props.fontSize}
        onChange={(v) => props.onFontSizeChange(Math.min(v, maxFontSize))}
        icon={<Square size={20} />}
      />

      {/* Hidden span to measure text */}
      <span
        ref={measureRef}
        style={{
          fontFamily: props.fontFamily,
          fontWeight: "normal",
          borderWidth: props.borderWidth,
          visibility: "hidden",
          position: "absolute",
          whiteSpace: "pre",
        }}
      >
        {props.textValue || "Text"}
      </span>

      <OutlineProperties
        onOpenOutline={() => setPanel("outline")}
        borderWidth={props.borderWidth}
        borderColor={props.borderColor}
      />
    </div>
  );
}
