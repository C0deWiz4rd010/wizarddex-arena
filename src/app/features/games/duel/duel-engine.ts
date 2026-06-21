import { Character } from '../../../core/models/character.model';
import { characterStats } from '../../../core/utils/combat-score';

export interface Combatant {
  id: string;
  name: string;
  image?: string | null;
  house?: string | null;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface BattleEvent {
  turn: number;
  attacker: string;
  defender: string;
  spell: string;
  damage: number;
  crit: boolean;
  defenderHp: number;
  defenderMaxHp: number;
  text: string;
}

export interface BattleResult {
  events: BattleEvent[];
  winnerId: string;
  winnerName: string;
  combatantA: Combatant;
  combatantB: Combatant;
}

const SPELLS = [
  'Expelliarmus',
  'Stupefy',
  'Petrificus Totalus',
  'Confringo',
  'Sectumsempra',
  'Reducto',
  'Incendio',
  'Bombarda',
  'Flipendo',
  'Diffindo',
];

/** Build a combatant with derived RPG stats from a character's profile. */
export function makeCombatant(c: Character): Combatant {
  const s = characterStats(c);
  return {
    id: c.id,
    name: c.name,
    image: c.image,
    house: c.house,
    maxHp: 60 + s.defense * 4 + s.total,
    hp: 60 + s.defense * 4 + s.total,
    attack: s.power * 3 + 8,
    defense: s.defense + 2,
    speed: s.mystery + s.wisdom + 1,
  };
}

function rollDamage(
  attacker: Combatant,
  defender: Combatant,
  rng: () => number,
): {
  damage: number;
  crit: boolean;
} {
  const variance = 0.75 + rng() * 0.5; // 0.75–1.25
  const base = Math.max(3, attacker.attack - defender.defense * 0.5);
  const crit = rng() < 0.16;
  const damage = Math.round(base * variance * (crit ? 1.8 : 1));
  return { damage: Math.max(1, damage), crit };
}

/**
 * Deterministic turn-based duel simulation.
 * Faster combatant strikes first; battle ends when one reaches 0 HP or after
 * a hard turn cap (decided by remaining HP ratio) to avoid infinite stalemates.
 */
export function simulateDuel(charA: Character, charB: Character, rng: () => number): BattleResult {
  const a = makeCombatant(charA);
  const b = makeCombatant(charB);
  const events: BattleEvent[] = [];

  // Initiative — higher speed acts first (ties broken by rng).
  let attacker = a.speed >= b.speed ? a : b;
  let defender = attacker === a ? b : a;
  if (a.speed === b.speed && rng() < 0.5) {
    [attacker, defender] = [defender, attacker];
  }

  let turn = 1;
  const MAX_TURNS = 60;
  while (a.hp > 0 && b.hp > 0 && turn <= MAX_TURNS) {
    const { damage, crit } = rollDamage(attacker, defender, rng);
    defender.hp = Math.max(0, defender.hp - damage);
    const spell = SPELLS[Math.floor(rng() * SPELLS.length)];
    events.push({
      turn,
      attacker: attacker.name,
      defender: defender.name,
      spell,
      damage,
      crit,
      defenderHp: defender.hp,
      defenderMaxHp: defender.maxHp,
      text: `${attacker.name} casts ${spell}${crit ? ' — a critical hit!' : ''} dealing ${damage} damage.`,
    });
    [attacker, defender] = [defender, attacker];
    turn++;
  }

  // Decide winner: by KO, else by remaining HP ratio.
  let winner: Combatant;
  if (a.hp === b.hp) {
    winner = a.maxHp >= b.maxHp ? a : b;
  } else if (a.hp <= 0) {
    winner = b;
  } else if (b.hp <= 0) {
    winner = a;
  } else {
    winner = a.hp / a.maxHp >= b.hp / b.maxHp ? a : b;
  }

  return {
    events,
    winnerId: winner.id,
    winnerName: winner.name,
    combatantA: a,
    combatantB: b,
  };
}
