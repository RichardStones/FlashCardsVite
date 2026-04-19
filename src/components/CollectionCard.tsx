import { Link } from 'react-router-dom';
import type { Collection } from '../types';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
  onDelete: (id: string) => void;
  onRename: (collection: Collection) => void;
}

export default function CollectionCard({ collection, onDelete, onRename }: CollectionCardProps) {
  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm(`Delete "${collection.name}"? This cannot be undone.`)) {
      onDelete(collection.id);
    }
  }

  function handleRename(e: React.MouseEvent) {
    e.preventDefault();
    onRename(collection);
  }

  return (
    <Link to={`/collection/${collection.id}`} className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.name}>{collection.name}</h3>
        <div className={styles.actions} onClick={e => e.stopPropagation()}>
          <button className={styles.iconBtn} onClick={handleRename} aria-label="Rename collection" title="Rename">
            ✏️
          </button>
          <button className={`${styles.iconBtn} ${styles.danger}`} onClick={handleDelete} aria-label="Delete collection" title="Delete">
            🗑️
          </button>
        </div>
      </div>
      <div className={styles.langs}>
        <span className={styles.langBadge}>{collection.learningLanguage}</span>
        <span className={styles.arrow}>→</span>
        <span className={styles.langBadge}>{collection.knownLanguage}</span>
      </div>
      <div className={styles.count}>
        {collection.cards.length} {collection.cards.length === 1 ? 'card' : 'cards'}
      </div>
    </Link>
  );
}
