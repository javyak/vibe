import { supabase } from "@/app/lib/supabaseClient";
import { ApiKey } from "../types/apiKey";

export const apiKeyService = {
  async fetchApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data
      .filter((item) => item && item.id && item.name && item.value)
      .map((item) => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        value: item.value,
        usage: Number(item.usage),
      }));
  },

  async createApiKey(name: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .insert([{ name, value, usage: 0 }]);

    if (error) {
      throw error;
    }
  },

  async updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiKey> {
    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteApiKey(id: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}; 