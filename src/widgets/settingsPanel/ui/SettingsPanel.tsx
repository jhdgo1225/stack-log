import { useSettingsStore } from "@/entities/settings";

export const SettingsPanel = () => {
  const soundOn = useSettingsStore((state) => state.soundOn);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const toggleSound = useSettingsStore((state) => state.toggleSound);
  const setReduceMotion = useSettingsStore((state) => state.setReduceMotion);

  return (
    <div className="settings-panel" role="group" aria-label="Game settings">
      <button
        type="button"
        className="toggle-chip"
        aria-pressed={soundOn}
        onClick={toggleSound}>
        Sound {soundOn ? "On" : "Off"}
      </button>
      <label className="toggle-switch" htmlFor="reduce-motion">
        <span>Reduce motion</span>
        <input
          id="reduce-motion"
          type="checkbox"
          checked={reduceMotion}
          onChange={(event) => setReduceMotion(event.target.checked)}
        />
      </label>
    </div>
  );
};
