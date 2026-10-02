import { PhishingScenarioTemplate } from './types';
import { GAMING_SCENARIOS } from './gamingScenarios';
import { SOCIAL_SCENARIOS } from './socialScenarios';
import { INSTITUTIONAL_SCENARIOS } from './institutionalScenarios';
import { WEB_SCENARIOS } from './webScenarios';

export const ALL_PHISHING_SCENARIOS: PhishingScenarioTemplate[] = [
  ...GAMING_SCENARIOS,
  ...SOCIAL_SCENARIOS,
  ...INSTITUTIONAL_SCENARIOS,
  ...WEB_SCENARIOS,
];

/**
 * Fisher-Yates Shuffle zur Erzeugung einer zufälligen Reihenfolge
 */
function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * Wählt eine zufällig gemischte Sequenz von Szenarien für eine Spielsitzung aus.
 * Stellt sicher, dass jeder Schüler ein individuelles, nicht vorhersehbares Erlebnis hat.
 */
export function getRandomScenarioSequence(count: number, avoidIds: string[] = []): PhishingScenarioTemplate[] {
  if (ALL_PHISHING_SCENARIOS.length === 0) {
    throw new Error('Keine Phishing-Szenarien verfügbar');
  }

  const preferred = ALL_PHISHING_SCENARIOS.filter((s) => !avoidIds.includes(s.id));
  const pool = preferred.length >= count ? preferred : ALL_PHISHING_SCENARIOS;
  const shuffled = shuffleArray(pool);

  if (shuffled.length >= count) {
    return shuffled.slice(0, count);
  }

  // Falls mehr Szenarien angefordert werden als im Pool existieren: mit Wiederholungen auffüllen
  const result: PhishingScenarioTemplate[] = [...shuffled];
  while (result.length < count) {
    const filler = shuffleArray(ALL_PHISHING_SCENARIOS);
    result.push(...filler.slice(0, count - result.length));
  }
  return result;
}

/**
 * Findet ein Szenario anhand der ID
 */
export function getScenarioById(id: string): PhishingScenarioTemplate | undefined {
  return ALL_PHISHING_SCENARIOS.find((s) => s.id === id);
}

/**
 * Generiert für die Live-KI einen zufällig angereicherten Kontext-Impuls,
 * damit auch wiederholte Läufe sprachlich und thematisch variieren.
 */
export function enrichContextWithRandomSeed(context: string): string {
  const platforms = ['auf dem iPad', 'im Schüler-Tablet', 'auf dem Smartphone', 'am Familien-PC'];
  const times = ['gerade in der großen Pause', 'am Nachmittag nach den Hausaufgaben', 'am Wochenende', 'abends'];
  const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]!;
  const randomTime = times[Math.floor(Math.random() * times.length)]!;
  
  return `${context} (Situation: Es passiert ${randomTime} ${randomPlatform}. Reagiere altersgerecht für 4.–6. Klasse).`;
}
