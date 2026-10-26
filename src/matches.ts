import { MATCHES_URL } from './config';
import type { Match, MatchesResponse } from './types';

export async function fetchMatches(signal?: AbortSignal): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL, { signal });
  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status}`);
  }
  const data = (await response.json()) as Partial<MatchesResponse>;
  if (!Array.isArray(data.matches)) {
    throw new Error('Неожиданный формат ответа');
  }
  return { round: data.round ?? 0, matches: data.matches };
}

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const FILTERS: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

// live и postponed не попадают ни в «Предстоящие», ни в «Завершённые»: только во «Все».
export function matchesFilter(match: Match, filter: MatchFilter): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'upcoming':
      return match.status === 'scheduled';
    case 'finished':
      return match.status === 'finished';
  }
}

function normalize(text: string) {
  return text.trim().toLocaleLowerCase('ru-RU').replaceAll('ё', 'е');
}

export function matchesQuery(match: Match, query: string): boolean {
  const needle = normalize(query);
  if (!needle) {
    return true;
  }
  return [match.home.name, match.away.name].some((name) => normalize(name).includes(needle));
}

export function statusLabel(match: Match): string {
  switch (match.status) {
    case 'scheduled':
      return 'Не начался';
    case 'live':
      return match.minute != null ? `Идёт, ${match.minute}′` : 'Идёт';
    case 'finished':
      return 'Завершён';
    case 'postponed':
      return 'Перенесён';
    default:
      return 'Статус неизвестен';
  }
}

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

// Без timeZone Intl берёт часовой пояс устройства.
export function formatStartsAt(startsAt: string | null): string {
  if (!startsAt) {
    return 'Дата не назначена';
  }
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return 'Дата не назначена';
  }
  return dateFormat.format(date);
}

export function formatScore(match: Match): string | null {
  if (!match.score) {
    return null;
  }
  return `${match.score.home} : ${match.score.away}`;
}
