import type { CSSProperties } from "react";

import { CHARACTER_LIST, useCharacterStore } from "@/entities/character";
import { classNames } from "@/shared/lib/classNames";

export const CharacterSelectPanel = () => {
  const selectedId = useCharacterStore((state) => state.selectedId);
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Character select</h2>
        <p className="panel-subtitle">Each style nudges your rhythm.</p>
      </header>
      <div className="character-grid">
        {CHARACTER_LIST.map((character) => {
          const isSelected = character.id === selectedId;

          return (
            <button
              key={character.id}
              type="button"
              className={classNames(
                "character-card",
                isSelected && "character-card--selected",
              )}
              style={
                {
                  "--accent": character.color,
                } as CSSProperties
              }
              aria-pressed={isSelected}
              onClick={() => selectCharacter(character.id)}>
              <span className="character-name">{character.name}</span>
              <span className="character-tagline">{character.tagline}</span>
              <span className="character-trait">{character.trait}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
