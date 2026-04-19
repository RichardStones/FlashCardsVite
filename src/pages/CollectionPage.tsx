import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCollections } from '../store/useCollections';
import type { Card } from '../types';
import FlashCard from '../components/FlashCard';
import Modal from '../components/Modal';
import CardForm from '../components/CardForm';
import styles from './CollectionPage.module.css';

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, addCard, updateCard, deleteCard, resetCollectionStats } = useCollections();

  const collection = collections.find(c => c.id === id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editCard, setEditCard] = useState<Card | null>(null);

  if (!collection) {
    navigate('/');
    return null;
  }

  function handleAddCard(data: Pick<Card, 'front' | 'back'>) {
    addCard(collection!.id, data);
    setModalOpen(false);
  }

  function handleEditCard(data: Pick<Card, 'front' | 'back'>) {
    if (!editCard) return;
    updateCard(collection!.id, editCard.id, data);
    setEditCard(null);
  }

  function handleReset() {
    if (confirm('Reset all scores for this collection?')) {
      resetCollectionStats(collection!.id);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setEditCard(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.back}>← Collections</Link>
      </div>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{collection.name}</h1>
          <div className={styles.langs}>
            <span className={styles.langBadge}>{collection.learningLanguage}</span>
            <span>→</span>
            <span className={styles.langBadge}>{collection.knownLanguage}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary} onClick={handleReset}>
            Reset scores
          </button>
          <button className={styles.btnSecondary} onClick={() => setModalOpen(true)}>
            + Add card
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate(`/collection/${id}/learn`)}
            disabled={collection.cards.length === 0}
          >
            Start learning
          </button>
        </div>
      </header>

      {collection.cards.length === 0 ? (
        <div className={styles.empty}>
          <p>No cards yet.</p>
          <p>Add your first card to get started!</p>
          <button className={styles.btnPrimary} onClick={() => setModalOpen(true)}>
            + Add card
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {collection.cards.map(card => (
            <FlashCard
              key={card.id}
              card={card}
              learningLanguage={collection.learningLanguage}
              knownLanguage={collection.knownLanguage}
              onEdit={setEditCard}
              onDelete={cardId => deleteCard(collection.id, cardId)}
            />
          ))}
        </div>
      )}

      <Modal title="Add card" isOpen={modalOpen} onClose={closeModal}>
        <CardForm
          learningLanguage={collection.learningLanguage}
          knownLanguage={collection.knownLanguage}
          onSubmit={handleAddCard}
          onCancel={closeModal}
        />
      </Modal>

      <Modal title="Edit card" isOpen={editCard !== null} onClose={closeModal}>
        {editCard && (
          <CardForm
            initial={editCard}
            learningLanguage={collection.learningLanguage}
            knownLanguage={collection.knownLanguage}
            onSubmit={handleEditCard}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
