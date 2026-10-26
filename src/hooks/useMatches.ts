import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../matches';
import type { Match } from '../types';

type State = {
  matches: Match[] | null;
  error: string | null;
  loading: boolean;
  refreshing: boolean;
  // Момент последней успешной загрузки.
  updatedAt: Date | null;
};

const initialState: State = {
  matches: null,
  error: null,
  loading: true,
  refreshing: false,
  updatedAt: null,
};

export function useMatches() {
  const [state, setState] = useState<State>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      error: null,
      loading: mode === 'initial',
      refreshing: mode === 'refresh',
    }));

    try {
      const data = await fetchMatches(controller.signal);
      if (controller.signal.aborted) return;
      setState({
        matches: data.matches,
        error: null,
        loading: false,
        refreshing: false,
        updatedAt: new Date(),
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        loading: false,
        refreshing: false,
      }));
    }
  }, []);

  useEffect(() => {
    load('initial');
    return () => abortRef.current?.abort();
  }, [load]);

  const retry = useCallback(() => load('initial'), [load]);
  const refresh = useCallback(() => load('refresh'), [load]);

  return { ...state, retry, refresh };
}
