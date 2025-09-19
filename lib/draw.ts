import { tarotDeck, type TarotCard } from "./deck";
import { generateSeed, shuffleWithSeed, createSeededRng } from "./rng";
import { spreads, type SpreadDefinition } from "./spreads";

export type Orientation = "upright" | "reversed";

export interface DrawnCard {
  index: number;
  positionId: string;
  card: TarotCard;
  orientation: Orientation;
}

export interface DrawResult {
  seed: string;
  spreadId: SpreadDefinition["id"];
  cards: readonly DrawnCard[];
}

export function getSpread(spreadId: SpreadDefinition["id"]): SpreadDefinition {
  const spread = spreads.find((item) => item.id === spreadId);
  if (!spread) {
    throw new Error(`Unknown spread id: ${spreadId}`);
  }
  return spread;
}

export function drawSpread(options: {
  spreadId: SpreadDefinition["id"];
  seed?: string;
}): DrawResult {
  const spread = getSpread(options.spreadId);
  const finalSeed = options.seed ?? generateSeed();
  const cardCount = spread.positions.length;

  if (cardCount > tarotDeck.length) {
    throw new Error("Deck does not have enough cards for the selected spread");
  }

  const shuffledDeck = shuffleWithSeed(tarotDeck, finalSeed);
  const orientationRng = createSeededRng(`${finalSeed}-orientation`);

  const cards: DrawnCard[] = spread.positions.map((position, index) => {
    const card = shuffledDeck[index];
    const orientation: Orientation = orientationRng() > 0.5 ? "upright" : "reversed";

    return {
      index,
      positionId: position.id,
      card,
      orientation,
    };
  });

  return {
    seed: finalSeed,
    spreadId: spread.id,
    cards,
  };
}
