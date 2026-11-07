import styles from "./UserAvatar.module.css";

const palette = [
  ["#f9a8d4", "#db2777"],
  ["#fdba74", "#ea580c"],
  ["#a5b4fc", "#4f46e5"],
  ["#86efac", "#16a34a"],
  ["#c4b5fd", "#7c3aed"],
  ["#7dd3fc", "#0284c7"],
  ["#fca5a5", "#dc2626"],
] as const;

const colorsFor = (name: string): readonly [string, string] => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return palette[Math.abs(hash) % palette.length];
};

interface UserAvatarProps {
  username: string;
  size?: number;
  ring?: boolean;
}

const UserAvatar = ({ username, size = 32, ring = false }: UserAvatarProps) => {
  const [from, to] = colorsFor(username);
  const avatar = (
    <span
      className={styles.avatar}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {username.charAt(0) || "?"}
    </span>
  );

  if (!ring) return avatar;

  return (
    <span className={styles.ring}>
      <span className={styles.ringInner}>{avatar}</span>
    </span>
  );
};

export default UserAvatar;
