import Table from "./components/table/Table";
import styles from "./page.module.scss";

export default function GamePage() {
  return (
    <main className={styles.main}>
        <div className={styles.gameContainer}>
            <Table />
        </div>
    </main>
  );
}
