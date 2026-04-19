import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  total: number;
  correct: number;
  wrong: number;
}

export default function ProgressBar({ total, correct, wrong }: ProgressBarProps) {
  const remaining = total - correct - wrong;
  const pctCorrect = total > 0 ? (correct / total) * 100 : 0;
  const pctWrong = total > 0 ? (wrong / total) * 100 : 0;
  const pctRemaining = total > 0 ? (remaining / total) * 100 : 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.correct} style={{ width: `${pctCorrect}%` }} />
        <div className={styles.wrong} style={{ width: `${pctWrong}%` }} />
        <div className={styles.remaining} style={{ width: `${pctRemaining}%` }} />
      </div>
      <div className={styles.labels}>
        <span className={styles.labelCorrect}>{correct} correct</span>
        <span className={styles.labelWrong}>{wrong} wrong</span>
        <span className={styles.labelRemaining}>{remaining} remaining</span>
      </div>
    </div>
  );
}
