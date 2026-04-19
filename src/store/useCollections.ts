import { useState, useEffect } from 'react';
import type { Collection, Card, CollectionsStore } from '../types';

export function useCollections() {
  const [collections, setCollections] = useState<CollectionsStore>([]);
  const [loading, setLoading] = useState(true);

  // Initial load from file
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then((data: CollectionsStore) => {
        setCollections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Debounced save — batches rapid updates (e.g. learning mode) into one write
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      fetch('/api/data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collections),
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [collections, loading]);

  // --- Collection CRUD ---

  function createCollection(data: Omit<Collection, 'id' | 'cards' | 'createdAt'>) {
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      cards: [],
      createdAt: Date.now(),
      ...data,
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection.id;
  }

  function updateCollection(id: string, data: Partial<Omit<Collection, 'id' | 'cards' | 'createdAt'>>) {
    setCollections(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  }

  function deleteCollection(id: string) {
    setCollections(prev => prev.filter(c => c.id !== id));
  }

  // --- Card CRUD ---

  function addCard(collectionId: string, data: Pick<Card, 'front' | 'back'>) {
    const newCard: Card = {
      id: crypto.randomUUID(),
      front: data.front,
      back: data.back,
      stats: { seen: 0, correct: 0, wrong: 0 },
    };
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId ? { ...c, cards: [...c.cards, newCard] } : c
      )
    );
    return newCard.id;
  }

  function updateCard(collectionId: string, cardId: string, data: Pick<Card, 'front' | 'back'>) {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId
          ? {
              ...c,
              cards: c.cards.map(card =>
                card.id === cardId ? { ...card, ...data } : card
              ),
            }
          : c
      )
    );
  }

  function deleteCard(collectionId: string, cardId: string) {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId
          ? { ...c, cards: c.cards.filter(card => card.id !== cardId) }
          : c
      )
    );
  }

  function updateCardStats(
    collectionId: string,
    cardId: string,
    patch: Partial<{ seen: number; correct: number; wrong: number }>
  ) {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId
          ? {
              ...c,
              cards: c.cards.map(card =>
                card.id === cardId
                  ? { ...card, stats: { ...card.stats, ...patch } }
                  : card
              ),
            }
          : c
      )
    );
  }

  function resetCollectionStats(collectionId: string) {
    setCollections(prev =>
      prev.map(c =>
        c.id === collectionId
          ? {
              ...c,
              cards: c.cards.map(card => ({
                ...card,
                stats: { seen: 0, correct: 0, wrong: 0 },
              })),
            }
          : c
      )
    );
  }

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    addCard,
    updateCard,
    deleteCard,
    updateCardStats,
    resetCollectionStats,
  };
}
