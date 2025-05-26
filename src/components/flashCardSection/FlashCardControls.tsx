"use client";
import React, { useEffect } from "react";
import { Button, Tooltip } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
  SwapOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

interface ControlsProps {
  onPrev: () => void;
  onFlip: () => void;
  onNext: () => void;
  onShuffle?: () => void;
  onFullscreen?: () => void;
  showExtras?: boolean;
}

type ButtonShape = "circle" | "default" | "round";

export default function FlashCardControls({
  onPrev,
  onFlip,
  onNext,
  onShuffle,
  onFullscreen,
}: ControlsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          onFlip();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPrev, onNext, onFlip]);

  const actions: {
    title: string;
    icon: JSX.Element;
    onClick?: () => void;
    label?: string;
    shape?: ButtonShape;
  }[] = [
    {
      title: "Shuffle",
      icon: <SwapOutlined />,
      onClick: onShuffle,
      label: "Shuffle",
    },
    {
      title: "Previous (←)",
      icon: <LeftOutlined />,
      onClick: onPrev,
      shape: "circle",
    },
    {
      title: "Flip (Space)",
      icon: <ReloadOutlined />,
      onClick: onFlip,
      shape: "circle",
    },
    {
      title: "Next (→)",
      icon: <RightOutlined />,
      onClick: onNext,
      shape: "circle",
    },
    {
      title: "Fullscreen",
      icon: <FullscreenOutlined />,
      onClick: onFullscreen,
      label: "Fullscreen",
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        {actions.map(({ title, icon, onClick, label, shape }, index) => (
          <Tooltip key={index} title={title}>
            <Button icon={icon} onClick={onClick} shape={shape}>
              {label}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}