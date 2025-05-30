import { useRouter } from 'next/router';
import styles from '@/styles/index.module.css';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div
        className={styles.logo}
        onClick={() => router.push('/')}
        style={{ cursor: 'pointer' }} // 클릭 가능하게 커서 변경
      >
        <span>
          <Image src="/logo.png" alt="logo" width={70} height={70} />
        </span>
        do it<span className={styles.semicolon}>;</span>
      </div>
    </header>
  );
}
