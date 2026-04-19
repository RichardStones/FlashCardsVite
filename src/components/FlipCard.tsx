import styles from './FlipCard.module.css';

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onClick: () => void;
}

export default function FlipCard({ front, back, isFlipped, onClick }: FlipCardProps) {
  return (
    <div className={styles.scene}>
      <div
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onClick() : undefined}
        aria-label={isFlipped ? `Answer: ${back}` : `Question: ${front}. Click to flip.`}
      >
        <div className={`${styles.face} ${styles.front}`}>
          <span>{front}</span>
          <span className={styles.hint}>click to reveal</span>
        </div>
        <div className={`${styles.face} ${styles.back}`}>
          <span>{back}</span>
        </div>
      </div>
    </div>
  );
}
