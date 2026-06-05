import type { CSSProperties } from "react";

import type { ActiveBlock, Board, Point } from "@/entities/game";
import {
  canPlaceCells,
  getAbsoluteCells,
  getRenderBoard,
  HIDDEN_ROWS,
} from "@/entities/game";
import { usePerformanceTrace } from "@/shared/lib/performance/usePerformanceTrace";

type GameCanvasProps = {
  board: Board;
  active: ActiveBlock | null;
  obstaclePreviewBlocks?: Point[][];
};

export const GameCanvas = ({
  board,
  active,
  obstaclePreviewBlocks = [],
}: GameCanvasProps) => {
  usePerformanceTrace("widget.gameCanvas", {
    meta: {
      rows: board.length,
      cols: board[0]?.length ?? 0,
    },
  });

  const renderBoard = getRenderBoard(board, null);
  const rows = renderBoard.length;
  const cols = renderBoard[0]?.length ?? 0;
  const activeCells =
    active?.cells
      .map((cell, index) => ({
        id: `${active.id}-${index}`,
        x: active.position.x + cell.x,
        y: active.position.y + cell.y - HIDDEN_ROWS,
      }))
      .filter((cell) => cell.y >= 0 && cell.y < rows) ?? [];
  const ghostCells =
    active !== null
      ? (() => {
          let ghostPosition = {
            ...active.position,
          };

          while (
            canPlaceCells(
              board,
              getAbsoluteCells({
                ...active,
                position: { x: ghostPosition.x, y: ghostPosition.y + 1 },
              }),
            )
          ) {
            ghostPosition = {
              x: ghostPosition.x,
              y: ghostPosition.y + 1,
            };
          }

          return getAbsoluteCells({
            ...active,
            position: ghostPosition,
          })
            .map((cell, index) => ({
              id: `${active.id}-ghost-${index}`,
              x: cell.x,
              y: cell.y - HIDDEN_ROWS,
            }))
            .filter((cell) => cell.y >= 0 && cell.y < rows);
        })()
      : [];
  const previewCells = obstaclePreviewBlocks
    .flatMap((block, blockIndex) =>
      block.map((cell, cellIndex) => ({
        id: `obstacle-preview-${blockIndex}-${cellIndex}`,
        x: cell.x,
        y: cell.y - HIDDEN_ROWS,
      })),
    )
    .filter((cell) => cell.y >= 0 && cell.y < rows);

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
      }
    >
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
      {ghostCells.length > 0 ? (
        <div className="ghost-block-layer" aria-hidden="true">
          {ghostCells.map((cell) => (
            <span
              key={cell.id}
              className="ghost-block-cell"
              style={
                {
                  "--ghost-x": cell.x,
                  "--ghost-y": cell.y,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}
      <div className="active-block-layer" aria-hidden="true">
        {activeCells.map((cell) => (
          <span
            key={cell.id}
            className="active-block-cell"
            style={
              {
                "--active-x": cell.x,
                "--active-y": cell.y,
              } as CSSProperties
            }
          />
        ))}
      </div>
      {previewCells.length > 0 ? (
        <div className="obstacle-preview-layer" aria-hidden="true">
          {previewCells.map((cell) => (
            <span
              key={cell.id}
              className="obstacle-preview-cell"
              style={
                {
                  "--preview-x": cell.x,
                  "--preview-y": cell.y,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
