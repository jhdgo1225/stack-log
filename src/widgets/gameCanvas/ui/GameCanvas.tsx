import type { CSSProperties } from "react";

import { getRenderBoard } from "@/entities/game";
import type { Board } from "@/entities/game";
import type { ActiveBlock } from "@/entities/game/model/types";

type GameCanvasProps = {
  board: Board;
  active: ActiveBlock | null;
};

export const GameCanvas = ({ board, active }: GameCanvasProps) => {
  const renderBoard = getRenderBoard(board, active);
  const rows = renderBoard.length;
  const cols = renderBoard[0]?.length ?? 0;

  return (
    <div
      className="game-board"
      role="grid"
      aria-label="Game board"
      style={
        {
          "--rows": rows,
          "--cols": cols,
        } as CSSProperties
      }>
      {renderBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`cell-${rowIndex}-${colIndex}`}
            className="game-cell"
            data-state={cell}
            role="gridcell"
            aria-hidden="true"
          />
        )),
      )}
    </div>
  );
};
