import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { state, reload } = useMatches();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура</Text>

      {state.status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.hint}>Загружаем матчи…</Text>
        </View>
      )}

      {state.status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Не удалось загрузить матчи</Text>
          <Text style={styles.hint}>{state.message}</Text>
          <Pressable style={styles.button} onPress={reload} accessibilityRole="button">
            <Text style={styles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      )}

      {state.status === 'success' && (
        <FlatList
          data={state.matches}
          keyExtractor={(match) => match.id}
          renderItem={({ item }) => <MatchCard match={item} />}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.hint}>В этом туре пока нет матчей</Text>
            </View>
          }
        />
      )}
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
