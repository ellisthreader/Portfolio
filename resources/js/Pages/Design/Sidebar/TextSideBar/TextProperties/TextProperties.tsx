"use client";

import React, { useState } from "react";

import TextArea from "./TextArea";
import FontSelector from "./FontSelector";
import FontPage from "./FontPage";
import ColorPicker from "./ColorPicker";
import RangeSlider from "./RangeSlider";
import OutlineProperties from "./OutlineProperties";
import OutlinePage from "./OutlinePage";

import { RotateCw, Square } from "lucide-react";

export default function TextProperties(props) {
  const [panel, setPanel] = useState<"main" | "fonts" | "outline">("main");

  // ---- Fonts panel ----
  if (panel === "fonts") {
    return (
      <div className="p-4">
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
      <div className="p-4">
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

  // ---- Main panel ----
  return (
    <div className="space-y-6 p-4">
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
        icon={<RotateCw size={16} />}
      />

      <RangeSlider
        label="Text Size"
        min={8}
        max={150}
        value={props.fontSize}
        onChange={props.onFontSizeChange}
        icon={<Square size={16} />}
      />

      <OutlineProperties
        onOpenOutline={() => setPanel("outline")}
      />
    </div>
  );
}
