import styles from "./Wordmark.module.css";

interface WordmarkProps {
  className?: string;
}

const Wordmark = ({ className }: WordmarkProps) => (
  <span className={`${styles.wordmark} ${className ?? ""}`}>
    kap<span className={styles.accent}>sule</span>
  </span>
);

export default Wordmark;
