import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCollections } from '../store/useCollections';
import type { Card } from '../types';
import { selectNextCard } from '../utils/weightedRandom';
import FlipCard from '../components/FlipCard';
import ProgressBar from '../components/ProgressBar';
import styles from './LearningPage.module.css';

export default function LearningPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, updateCardStats } = useCollections();

  const collection = collections.find(c => c.id === id);

  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [lastCardId, setLastCardId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);
  const [finished, setFinished] = useState(false);

  // Track whether seen has been incremented for the current card presentation
  const seenIncrementedRef = useRef<string | null>(null);
  // Ensures first card is picked only once, even though collection loads async
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!collection || collection.cards.length === 0) return;
    initializedRef.current = true;
    const first = selectNextCard(collection.cards, null);
    setCurrentCard(first);
  }, [collection]); // re-runs when collection arrives from the server

  // Increment "seen" exactly once per card presentation
  useEffect(() => {
    if (!currentCard || !collection) return;
    if (seenIncrementedRef.current === currentCard.id) return;
    seenIncrementedRef.current = currentCard.id;
    updateCardStats(collection.id, currentCard.id, {
      seen: currentCard.stats.seen + 1,
    });
  }, [currentCard?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!collection) {
    navigate('/');
    return null;
  }

  if (collection.cards.length === 0) {
    return (
      <div className={styles.page}>
        <p>No cards in this collection.</p>
        <Link to={`/collection/${id}`}>← Back</Link>
      </div>
    );
  }

  function handleFlip() {
    setIsFlipped(prev => !prev);
  }

  function handleAnswer(correct: boolean) {
    if (!currentCard || !collection) return;

    const updatedStats = {
      correct: currentCard.stats.correct + (correct ? 1 : 0),
      wrong: currentCard.stats.wrong + (correct ? 0 : 1),
    };
    updateCardStats(collection.id, currentCard.id, updatedStats);

    if (correct) setSessionCorrect(n => n + 1);
    else setSessionWrong(n => n + 1);

    // Get fresh card list from collection state isn't updated yet here,
    // so merge the updated stats locally for weight calculation
    const updatedCards = collection.cards.map(c =>
      c.id === currentCard.id
        ? { ...c, stats: { ...c.stats, ...updatedStats } }
        : c
    );

    const next = selectNextCard(updatedCards, currentCard.id);
    setLastCardId(currentCard.id);
    setCurrentCard(next);
    setIsFlipped(false);
  }

  function handleFinish() {
    setFinished(true);
  }

  const totalSeen = sessionCorrect + sessionWrong;

  if (finished) {
    return (
      <div className={styles.page}>
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Session complete!</h2>
          <div className={styles.summaryStats}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryNum}>{totalSeen}</span>
              <span className={styles.summaryLabel}>cards reviewed</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={`${styles.summaryNum} ${styles.correct}`}>{sessionCorrect}</span>
              <span className={styles.summaryLabel}>correct</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={`${styles.summaryNum} ${styles.wrong}`}>{sessionWrong}</span>
              <span className={styles.summaryLabel}>wrong</span>
            </div>
          </div>
          {totalSeen > 0 && (
            <div className={styles.summaryPct}>
              {Math.round((sessionCorrect / totalSeen) * 100)}% accuracy
            </div>
          )}
          <div className={styles.summaryActions}>
            <Link to={`/collection/${id}`} className={styles.btnSecondary}>
              Back to collection
            </Link>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                setFinished(false);
                setSessionCorrect(0);
                setSessionWrong(0);
                setIsFlipped(false);
                seenIncrementedRef.current = null;
                const first = selectNextCard(collection.cards, null);
                setCurrentCard(first);
              }}
            >
              Study again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to={`/collection/${id}`} className={styles.back}>← {collection.name}</Link>
        <button className={styles.finishBtn} onClick={handleFinish}>Finish</button>
      </div>

      <div className={styles.langs}>
        <span className={styles.langBadge}>{collection.learningLanguage}</span>
        <span className={styles.arrow}>→</span>
        <span className={styles.langBadge}>{collection.knownLanguage}</span>
      </div>

      {currentCard && (
        <div className={styles.cardArea}>
          <FlipCard
            key={currentCard.id}
            front={currentCard.front}
            back={currentCard.back}
            isFlipped={isFlipped}
            onClick={handleFlip}
          />
        </div>
      )}

      <div className={styles.answerArea}>
        {isFlipped ? (
          <>
            <p className={styles.answerPrompt}>How did you do?</p>
            <div className={styles.answerBtns}>
              <button className={styles.btnWrong} onClick={() => handleAnswer(false)}>
                ✗ Wrong
              </button>
              <button className={styles.btnCorrect} onClick={() => handleAnswer(true)}>
                ✓ Correct
              </button>
            </div>
          </>
        ) : (
          <p className={styles.flipHint}>Click the card to reveal the answer</p>
        )}
      </div>

      <div className={styles.progressArea}>
        <ProgressBar
          total={collection.cards.length}
          correct={sessionCorrect}
          wrong={sessionWrong}
        />
      </div>

      <div className={styles.sessionStats}>
        <span>Session: <strong>{sessionCorrect}</strong> correct, <strong>{sessionWrong}</strong> wrong</span>
      </div>
    </div>
  );
}
