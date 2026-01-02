// /TextProperties/TextProperties.tsx
"use client";

import React from "react";
import TextArea from "./TextArea";
import FontSelector from "./FontSelector";
import ColorPicker from "./ColorPicker";
import RangeSlider from "./RangeSlider";
import BorderProperties from "./BorderProperties";
import { RotateCw, Square } from "lucide-react";

type Props = {
  textValue: string;
  onTextChange: (v: string) => void;

  fontFamily: string;
  onFontChange: (v: string) => void;

  color: string;
  onColorChange: (v: string) => void;

  rotation: number;
  onRotationChange: (v: number) => void;

  fontSize: number;
  onFontSizeChange: (v: number) => void;

  borderColor: string;
  onBorderColorChange: (v: string) => void;

  borderWidth: number;
  onBorderWidthChange: (v: number) => void;
};

export default function TextProperties(props: Props) {
  return (
    <div className="space-y-6 p-4">
      <TextArea textValue={props.textValue} onTextChange={props.onTextChange} />
      <FontSelector fontFamily={props.fontFamily} onFontChange={props.onFontChange} />
      <ColorPicker color={props.color} onColorChange={props.onColorChange} />
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
      <BorderProperties
        borderColor={props.borderColor}
        onBorderColorChange={props.onBorderColorChange}
        borderWidth={props.borderWidth}
        onBorderWidthChange={props.onBorderWidthChange}
      />
    </div>
  );
}
