import styles from "./page.module.scss";
import Link from "next/link";
import Image from "next/image";
import Rules from "./rules/Rules";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <Image src="/logo.png" alt="Tien Len Logo" width={200} height={200} />
      <h1>Tiến Lên!</h1>
      <Link href="/play">
        <button>Start Game</button>
      </Link>
      <Rules/>

      <br /><br />
      Please support the project on{' '}
      <a 
        href="https://buymeacoffee.com/DanHChampion" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.coffeeLink}
      >
        ☕ Buy Me a Coffee
      </a>
    </main>
  );
}
