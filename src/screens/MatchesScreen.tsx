import { useMemo, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { matchesFilter, type MatchFilter } from '../matches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, error, loading, refreshing, updatedAt, retry, refresh } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const { favorites, isFavorite, toggle } = useFavorites();

  const visibleMatches = useMemo(
    () => (matches ?? []).filter((match) => matchesFilter(match, filter)),
    [matches, filter],
  );

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.hint}>Загружаем матчи…</Text>
        </View>
      </Screen>
    );
  }

  if (!matches) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Не удалось загрузить матчи</Text>
          {error && <Text style={styles.hint}>{error}</Text>}
          <Pressable style={styles.button} onPress={retry} accessibilityRole="button">
            <Text style={styles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.toolbar}>
        {updatedAt && <UpdatedAgo since={updatedAt} />}
        <Pressable
          onPress={refresh}
          disabled={refreshing}
          accessibilityRole="button"
          style={styles.refreshButton}
        >
          <Text style={[styles.refreshText, refreshing && styles.disabled]}>
            {refreshing ? 'Обновляем…' : 'Обновить'}
          </Text>
        </Pressable>
      </View>

      {error && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Не удалось обновить: {error}</Text>
        </View>
      )}

      <FilterTabs value={filter} onChange={setFilter} />

      <FlatList
        data={visibleMatches}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => (
          <MatchCard match={item} favorite={isFavorite(item.id)} onToggleFavorite={toggle} />
        )}
        extraData={favorites}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.hint}>
              {matches.length === 0
                ? 'В этом туре пока нет матчей'
                : 'Нет матчей с таким статусом'}
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>
      {children}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refreshButton: {
    paddingVertical: 4,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  disabled: {
    color: '#9ca3af',
  },
  banner: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  bannerText: {
    fontSize: 13,
    color: '#b91c1c',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  separator: {
    height: 8,
  },
});
