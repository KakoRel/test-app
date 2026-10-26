export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  // ISO-время в UTC; null, если дата не назначена (например, матч перенесён).
  startsAt: string | null;
  // Статус приходит строкой: сервер может прислать значение, которого нет в MatchStatus.
  status: MatchStatus | (string & {});
  minute?: number;
  home: Team;
  away: Team;
  score: Score | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};
