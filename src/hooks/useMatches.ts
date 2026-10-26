import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../matches';
import type { Match } from '../types';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; matches: Match[] };

export function useMatches() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: 'loading' });
    try {
      const data = await fetchMatches(controller.signal);
      if (!controller.signal.aborted) {
        setState({ status: 'success', matches: data.matches });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        });
      }
    }
  }, []);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  return { state, reload: load };
}
