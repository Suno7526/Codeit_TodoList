import styles from '@/styles/index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.eyes}>👀</span>
        do it<span className={styles.semicolon}>;</span>
      </div>
    </header>
  );
}