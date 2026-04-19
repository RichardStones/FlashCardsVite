import { useState } from 'react';
import { useCollections } from '../store/useCollections';
import type { Collection } from '../types';
import CollectionCard from '../components/CollectionCard';
import Modal from '../components/Modal';
import CollectionForm from '../components/CollectionForm';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { collections, createCollection, updateCollection, deleteCollection } = useCollections();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Collection | null>(null);

  function handleCreate(data: Omit<Collection, 'id' | 'cards' | 'createdAt'>) {
    createCollection(data);
    setModalOpen(false);
  }

  function handleRename(data: Omit<Collection, 'id' | 'cards' | 'createdAt'>) {
    if (!editTarget) return;
    updateCollection(editTarget.id, data);
    setEditTarget(null);
  }

  function openRename(collection: Collection) {
    setEditTarget(collection);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>FlashCards</h1>
          <p className={styles.subtitle}>Your vocabulary collections</p>
        </div>
        <button className={styles.btnNew} onClick={() => setModalOpen(true)}>
          + New collection
        </button>
      </header>

      {collections.length === 0 ? (
        <div className={styles.empty}>
          <p>No collections yet.</p>
          <p>Create one to get started!</p>
          <button className={styles.btnNew} onClick={() => setModalOpen(true)}>
            + New collection
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {collections.map(col => (
            <CollectionCard
              key={col.id}
              collection={col}
              onDelete={deleteCollection}
              onRename={openRename}
            />
          ))}
        </div>
      )}

      <Modal title="New collection" isOpen={modalOpen} onClose={closeModal}>
        <CollectionForm onSubmit={handleCreate} onCancel={closeModal} />
      </Modal>

      <Modal
        title="Rename collection"
        isOpen={editTarget !== null}
        onClose={closeModal}
      >
        {editTarget && (
          <CollectionForm
            initial={editTarget}
            onSubmit={handleRename}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
