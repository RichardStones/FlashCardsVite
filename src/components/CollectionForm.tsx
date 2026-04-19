import { useState } from 'react';
import type { Collection } from '../types';
import styles from './Form.module.css';

interface CollectionFormProps {
  initial?: Collection;
  onSubmit: (data: Omit<Collection, 'id' | 'cards' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function CollectionForm({ initial, onSubmit, onCancel }: CollectionFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [learningLanguage, setLearningLanguage] = useState(initial?.learningLanguage ?? '');
  const [knownLanguage, setKnownLanguage] = useState(initial?.knownLanguage ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !learningLanguage.trim() || !knownLanguage.trim()) return;
    onSubmit({
      name: name.trim(),
      learningLanguage: learningLanguage.trim(),
      knownLanguage: knownLanguage.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Collection name</label>
        <input
          className={styles.input}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Basic Spanish"
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Language you are learning</label>
        <input
          className={styles.input}
          value={learningLanguage}
          onChange={e => setLearningLanguage(e.target.value)}
          placeholder="e.g. Spanish"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Language you know</label>
        <input
          className={styles.input}
          value={knownLanguage}
          onChange={e => setKnownLanguage(e.target.value)}
          placeholder="e.g. English"
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={!name.trim() || !learningLanguage.trim() || !knownLanguage.trim()}
        >
          {initial ? 'Save changes' : 'Create collection'}
        </button>
      </div>
    </form>
  );
}
