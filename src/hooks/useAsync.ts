import { useState, useCallback, useEffect, useRef } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Общий хук для асинхронных операций
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) => {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await asyncFunction();
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        onSuccess?.(result);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (isMountedRef.current) {
        setState({ data: null, loading: false, error: err });
        onError?.(err);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [execute, immediate]);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
  };
};

/**
 * Хук для редусера государственных данных (useReducer pattern)
 */
interface ReducerState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type ReducerAction<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: Error }
  | { type: 'RESET' };

export const useAsyncReducer = <T,>(
  asyncFunction: () => Promise<T>,
  initialState: ReducerState<T> = { data: null, loading: false, error: null },
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) => {
  const [state, dispatch] = useState<ReducerState<T>>(initialState);
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    dispatch({ type: 'LOADING' });

    try {
      const result = await asyncFunction();
      if (isMountedRef.current) {
        dispatch({ type: 'SUCCESS', payload: result });
        onSuccess?.(result);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (isMountedRef.current) {
        dispatch({ type: 'ERROR', payload: err });
        onError?.(err);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    execute();

    return () => {
      isMountedRef.current = false;
    };
  }, [execute]);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
  };
};

/**
 * Пагинируемые данные
 */
interface PaginatedState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export const useAsyncPaginated = <T,>(
  asyncFunction: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  pageSize: number = 20
) => {
  const [state, setState] = useState<PaginatedState<T>>({
    data: [],
    loading: true,
    error: null,
    page: 1,
    pageSize,
    total: 0,
    hasMore: false,
  });

  const isMountedRef = useRef(true);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFunction(pageNum, pageSize);
        if (isMountedRef.current) {
          setState({
            data: result.data,
            loading: false,
            error: null,
            page: pageNum,
            pageSize,
            total: result.total,
            hasMore: pageNum * pageSize < result.total,
          });
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (isMountedRef.current) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err,
          }));
        }
      }
    },
    [asyncFunction, pageSize]
  );

  useEffect(() => {
    fetchPage(1);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPage]);

  const goToPage = useCallback(
    (page: number) => {
      fetchPage(page);
    },
    [fetchPage]
  );

  const nextPage = useCallback(() => {
    setState((prev) => {
      if (prev.hasMore) {
        fetchPage(prev.page + 1);
      }
      return prev;
    });
  }, [fetchPage]);

  const prevPage = useCallback(() => {
    setState((prev) => {
      if (prev.page > 1) {
        fetchPage(prev.page - 1);
      }
      return prev;
    });
  }, [fetchPage]);

  const retry = useCallback(() => {
    fetchPage(state.page);
  }, [fetchPage, state.page]);

  return {
    ...state,
    goToPage,
    nextPage,
    prevPage,
    retry,
  };
};
