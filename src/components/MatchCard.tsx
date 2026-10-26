import { StyleSheet, Text, View } from 'react-native';
import { formatScore, formatStartsAt, statusLabel } from '../matches';
import type { Match } from '../types';

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  const score = formatScore(match);
  const isLive = match.status === 'live';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.status, isLive && styles.live]}>{statusLabel(match)}</Text>
      </View>
      <View style={styles.teams}>
        <Text style={styles.team} numberOfLines={2}>
          {match.home.name}
        </Text>
        <Text style={styles.score}>{score ?? '–'}</Text>
        <Text style={[styles.team, styles.away]} numberOfLines={2}>
          {match.away.name}
        </Text>
      </View>
      <Text style={styles.date}>{formatStartsAt(match.startsAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    fontSize: 13,
    color: '#6b7280',
  },
  live: {
    color: '#ef3124',
    fontWeight: '600',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  away: {
    textAlign: 'right',
  },
  score: {
    minWidth: 56,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    color: '#374151',
  },
});
