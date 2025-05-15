import { supabase } from "@/app/lib/supabaseClient";
import { User } from "@/app/types/user";

// Helper function to format UUID
const formatUserId = (id: string): string => {
  // Check if the id is already a valid UUID
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(id)) {
    return id;
  }

  // For OAuth providers like Google, convert the ID to a valid UUID v5 format
  // This will create a deterministic UUID based on the input string
  
  // Simple hash function to generate a number from a string
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  // Generate a deterministic UUID-like string
  const generateUUID = (input: string): string => {
    // Create parts using hash of input plus some added values for uniqueness
    const p1 = hashString(input).toString(16).padStart(8, '0');
    const p2 = hashString(input + 'a').toString(16).padStart(4, '0');
    const p3 = hashString(input + 'b').toString(16).padStart(4, '0');
    const p4 = hashString(input + 'c').toString(16).padStart(4, '0');
    const p5 = hashString(input + 'd').toString(16).padStart(12, '0');
    
    // Format as UUID
    return `${p1.substring(0, 8)}-${p2.substring(0, 4)}-${p3.substring(0, 4)}-${p4.substring(0, 4)}-${p5.substring(0, 12)}`;
  };
  
  return generateUUID(`google-${id}`);
};

export const userService = {
  // Expose the formatUserId function
  formatUserId,
  /**
   * Create or update a user in the Supabase database
   * Used when a user logs in for the first time
   */
  async upsertUser(userData: User): Promise<User> {
    try {
      const formattedId = formatUserId(userData.id);
      
      const { error } = await supabase
        .from('users')
        .upsert({
          id: formattedId,
          email: userData.email,
          name: userData.name,
          image: userData.image,
          last_login: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });
  
      if (error) {
        console.error('Error upserting user:', error);
        throw error;
      }
  
      return { ...userData, id: formattedId };
    } catch (error) {
      console.error('Exception in upsertUser:', error);
      // Return the original user data to prevent breaking the auth flow
      return userData;
    }
  },

  /**
   * Check if a user exists in the database
   */
  async checkUserExists(userId: string): Promise<boolean> {
    try {
      const formattedId = formatUserId(userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', formattedId)
        .single();
  
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return false;
        }
        console.error('Error checking if user exists:', error);
        throw error;
      }
  
      return !!data;
    } catch (error) {
      console.error('Exception in checkUserExists:', error);
      // Default to false to ensure we try to create the user
      return false;
    }
  },

  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const formattedId = formatUserId(userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', formattedId)
        .single();
  
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return null;
        }
        console.error('Error getting user by ID:', error);
        throw error;
      }
  
      return data;
    } catch (error) {
      console.error('Exception in getUserById:', error);
      return null;
    }
  },

  /**
   * Update a user's last login time
   */
  async updateLastLogin(userId: string): Promise<void> {
    try {
      const formattedId = formatUserId(userId);
      
      const { error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', formattedId);
  
      if (error) {
        console.error('Error updating last login:', error);
        throw error;
      }
    } catch (error) {
      console.error('Exception in updateLastLogin:', error);
      // Silent fail to not disrupt the authentication flow
    }
  },
  
  /**
   * Check if Supabase connection is working
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Try to query any table - this will tell us if our connection is working
      const { error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        console.error('Error connecting to Supabase:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Supabase:', error);
      return false;
    }
  }
};