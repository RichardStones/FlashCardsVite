export interface CardStats {
  seen: number;
  correct: number;
  wrong: number;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  stats: CardStats;
}

export interface Collection {
  id: string;
  name: string;
  learningLanguage: string;
  knownLanguage: string;
  cards: Card[];
  createdAt: number;
}

export type CollectionsStore = Collection[];
