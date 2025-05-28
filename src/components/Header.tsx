import styles from '@/styles/index.module.css';
import Image from 'next/image';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span>
        <Image src="/logo.png" alt="use" width={70} height={70} />
        </span>
        do it<span className={styles.semicolon}>;</span>
      </div>
    </header>
  );
}