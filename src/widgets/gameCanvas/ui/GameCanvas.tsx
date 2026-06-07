import { useEffect, useRef } from "react";

import * as Phaser from "phaser";

import { GameScene } from "@/widgets/gameCanvas/model/phaserGameScene";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";

export const GameCanvas = () => {
  usePerformanceTrace("widget.gameCanvas");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const renderScale = Math.max(1, window.devicePixelRatio || 1);

    if (!container) {
      return undefined;
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      transparent: true,
      backgroundColor: "#000000",
      pixelArt: false,
      roundPixels: true,
      antialias: true,
      scale: {
        mode: Phaser.Scale.NONE,
        width: Math.max(1, Math.round(container.clientWidth * renderScale)),
        height: Math.max(1, Math.round(container.clientHeight * renderScale)),
      },
      input: {
        keyboard: {
          capture: [
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.D,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.Q,
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.E,
            Phaser.Input.Keyboard.KeyCodes.R,
            Phaser.Input.Keyboard.KeyCodes.SHIFT,
            Phaser.Input.Keyboard.KeyCodes.ESC,
            Phaser.Input.Keyboard.KeyCodes.F1,
          ],
        },
      },
      scene: [GameScene],
    });

    gameRef.current = game;

    const resize = () => {
      const width = Math.max(1, Math.round(container.clientWidth * renderScale));
      const height = Math.max(1, Math.round(container.clientHeight * renderScale));

      game.scale.resize(width, height);

      if (game.canvas) {
        game.canvas.style.width = `${container.clientWidth}px`;
        game.canvas.style.height = `${container.clientHeight}px`;
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    return () => {
      observer.disconnect();
      gameRef.current = null;
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="phaser-board-shell"
      aria-label="Game board"
    />
  );
};
