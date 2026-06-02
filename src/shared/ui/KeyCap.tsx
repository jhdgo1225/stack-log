type KeyCapProps = {
  label: string;
};

export const KeyCap = ({ label }: KeyCapProps) => (
  <span className="keycap">{label}</span>
);
