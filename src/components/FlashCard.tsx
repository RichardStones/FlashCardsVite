import type { Card } from '../types';
import styles from './FlashCard.module.css';

interface FlashCardProps {
  card: Card;
  learningLanguage: string;
  knownLanguage: string;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
}

export default function FlashCard({ card, learningLanguage, knownLanguage, onEdit, onDelete }: FlashCardProps) {
  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm('Delete this card?')) onDelete(card.id);
  }

  return (
    <div className={styles.card}>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => onEdit(card)} aria-label="Edit card" title="Edit">✏️</button>
        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={handleDelete} aria-label="Delete card" title="Delete">🗑️</button>
      </div>
      <div className={styles.content}>
        <div className={styles.side}>
          <span className={styles.lang}>{learningLanguage}</span>
          <span className={styles.word}>{card.front}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.side}>
          <span className={styles.lang}>{knownLanguage}</span>
          <span className={styles.word}>{card.back}</span>
        </div>
      </div>
      <div className={styles.stats}>
        <span className={styles.stat} title="Times seen">👁 {card.stats.seen}</span>
        <span className={`${styles.stat} ${styles.correct}`} title="Correct">✓ {card.stats.correct}</span>
        <span className={`${styles.stat} ${styles.wrong}`} title="Wrong">✗ {card.stats.wrong}</span>
      </div>
    </div>
  );
}
