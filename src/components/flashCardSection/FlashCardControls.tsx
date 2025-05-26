/* File: src/components/flashCardSection/FlashCardControls.tsx */
"use client";
import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import { LeftOutlined, RightOutlined, ReloadOutlined, SwapOutlined, SettingOutlined, FullscreenOutlined } from "@ant-design/icons";

interface ControlsProps {
  onPrev: () => void;
  onFlip: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
  showExtras?: boolean;
}

export default function FlashCardControls({ 
  onPrev, onFlip, onNext, 
  onShuffle, onSettings, onFullscreen, showExtras 
}: ControlsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft": onPrev(); break;
        case "ArrowRight": onNext(); break;
        case " ": case "Enter": e.preventDefault(); onFlip(); break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPrev, onNext, onFlip]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        <Tooltip title="Shuffle">
            <Button icon={<SwapOutlined />} onClick={onShuffle}>
              Shuffle
            </Button>
          </Tooltip>
        <Tooltip title="Previous (←)">
          <Button shape="circle" icon={<LeftOutlined />} onClick={onPrev} />
        </Tooltip>
        <Tooltip title="Flip (Space)">
          <Button shape="circle" icon={<ReloadOutlined />} onClick={onFlip} />
        </Tooltip>
        <Tooltip title="Next (→)">
          <Button shape="circle" icon={<RightOutlined />} onClick={onNext} />
        </Tooltip>
        <Tooltip title="Fullscreen">
            <Button icon={<FullscreenOutlined />} onClick={onFullscreen}>
              Fullscreen
            </Button>
          </Tooltip>
      </div>
    </div>
  );
}
