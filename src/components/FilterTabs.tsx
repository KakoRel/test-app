import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FILTERS, type MatchFilter } from '../matches';

type Props = {
  value: MatchFilter;
  onChange: (value: MatchFilter) => void;
};

export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {FILTERS.map((filter) => {
        const selected = filter.value === value;
        return (
          <Pressable
            key={filter.value}
            onPress={() => onChange(filter.value)}
            style={[styles.tab, selected && styles.selected]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  label: {
    fontSize: 14,
    color: '#111827',
  },
  selectedLabel: {
    color: '#fff',
  },
});
