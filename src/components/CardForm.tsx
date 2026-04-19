import { useState } from 'react';
import type { Card } from '../types';
import styles from './Form.module.css';

interface CardFormProps {
  initial?: Card;
  learningLanguage: string;
  knownLanguage: string;
  onSubmit: (data: Pick<Card, 'front' | 'back'>) => void;
  onCancel: () => void;
}

export default function CardForm({ initial, learningLanguage, knownLanguage, onSubmit, onCancel }: CardFormProps) {
  const [front, setFront] = useState(initial?.front ?? '');
  const [back, setBack]   = useState(initial?.back ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onSubmit({ front: front.trim(), back: back.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>{learningLanguage} (front)</label>
        <textarea
          className={styles.textarea}
          value={front}
          onChange={e => setFront(e.target.value)}
          placeholder={`Word or phrase in ${learningLanguage}`}
          rows={3}
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>{knownLanguage} (back)</label>
        <textarea
          className={styles.textarea}
          value={back}
          onChange={e => setBack(e.target.value)}
          placeholder={`Translation in ${knownLanguage}`}
          rows={3}
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={!front.trim() || !back.trim()}
        >
          {initial ? 'Save changes' : 'Add card'}
        </button>
      </div>
    </form>
  );
}
