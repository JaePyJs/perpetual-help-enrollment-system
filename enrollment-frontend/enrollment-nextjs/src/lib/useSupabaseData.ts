// src/lib/useSupabaseData.ts
"use client";

import { useState, useEffect } from "react";
import {
  supabase,
  handleSupabaseError,
  SupabaseResponse,
} from "./supabaseClient";

type FetchOptions = {
  table: string;
  select?: string;
  match?: Record<string, unknown>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
};

export function useSupabaseData<T>(options: FetchOptions): {
  data: T[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(options.table).select(options.select || "*");

      // Add match conditions if provided
      if (options.match) {
        Object.entries(options.match).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Add ordering if provided
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      // Add limit if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setData(null);
      } else {
        setData(data as T[]);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.table, JSON.stringify(options.match)]);

  return { data, loading, error, refetch: fetchData };
}

export async function createRecord<T>(
  table: string,
  data: Record<string, unknown>
): Promise<SupabaseResponse<T>> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) {
      return handleSupabaseError(error);
    }

    return { data: result[0] as T, error: null };
  } catch (err: unknown) {
    return handleSupabaseError(err);
  }
}

export async function updateRecord<T>(
  table: string,
  id: string | number,
  data: Record<string, unknown>
): Promise<SupabaseResponse<T>> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select();

    if (error) {
      return handleSupabaseError(error);
    }

    return { data: result[0] as T, error: null };
  } catch (err: unknown) {
    return handleSupabaseError(err);
  }
}

export async function deleteRecord(
  table: string,
  id: string | number
): Promise<SupabaseResponse<null>> {
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      return handleSupabaseError(error);
    }

    return { data: null, error: null };
  } catch (err: unknown) {
    return handleSupabaseError(err);
  }
}
