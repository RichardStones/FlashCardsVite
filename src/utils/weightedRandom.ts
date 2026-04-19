import type { Card } from '../types';

/**
 * Card selection via UCB1 (Upper Confidence Bound), a multi-armed bandit algorithm.
 *
 * UCB score = difficulty + C * √( ln(N) / n_i )
 *
 *   difficulty  = wrong / seen   — how often we get this card wrong
 *   N           = total seen events across all cards
 *   n_i         = times this card has been seen
 *   C           = exploration constant (how aggressively to revisit rare cards)
 *
 * Behaviour:
 *   - Unseen cards (n_i = 0) → score = ∞, always selected first (full exploration phase)
 *   - After all cards are seen once: cards with high wrong rate + low seen count score highest
 *   - As a card is seen more, its exploration bonus shrinks → known cards fade naturally
 *   - 5% of picks are a pure random override to prevent the algorithm feeling mechanical
 */

const EPSILON = 0.05; // probability of a fully random pick
const UCB_C = 1.0;    // exploration constant — higher = revisit rare cards more aggressively

export function ucbScore(card: Card, totalSeen: number): number {
  if (card.stats.seen === 0) return Infinity;

  const difficulty  = card.stats.wrong / card.stats.seen;
  const exploration = UCB_C * Math.sqrt(Math.log(Math.max(1, totalSeen)) / card.stats.seen);

  return difficulty + exploration;
}

/**
 * Select the next card to show.
 *
 * excludeId: the last-shown card — always excluded to prevent an immediate repeat.
 */
export function selectNextCard(cards: Card[], excludeId: string | null): Card | null {
  if (cards.length === 0) return null;
  if (cards.length === 1) return cards[0];

  const candidates = cards.filter(c => c.id !== excludeId);
  if (candidates.length === 0) return cards[0];

  // 5% random override — pure exploration regardless of scores
  if (Math.random() < EPSILON) {
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  // Compute N = total seen events across the full deck (not just candidates)
  const totalSeen = cards.reduce((sum, c) => sum + c.stats.seen, 0);

  // Find the highest UCB score
  const scores = candidates.map(c => ucbScore(c, totalSeen));
  const maxScore = Math.max(...scores);

  // Collect all candidates tied at the max (handles the Infinity tie among unseen cards)
  const best = candidates.filter((_, i) => scores[i] === maxScore);

  // Break ties randomly so unseen cards don't always appear in the same order
  return best[Math.floor(Math.random() * best.length)];
}
