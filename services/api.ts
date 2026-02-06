import { supabase } from '../lib/supabase';
import { Profile, Wish } from '../types';

// Profile
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createProfile = async (userId: string, username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, username, role: 'user' }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const findProfileByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Connection
export const getConnection = async (userId: string) => {
  // With 2-row logic, we can just check where user_id is the current user.
  // user_id is unique in the connections table.
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createConnection = async (myId: string, partnerId: string) => {
  // New logic: Insert two rows for bidirectional lookup logic.
  // The database unique constraint on user_id prevents multiple connections.
  const { data, error } = await supabase
    .from('connections')
    .insert([
      { user_id: myId, partner_id: partnerId },
      { user_id: partnerId, partner_id: myId }
    ])
    .select();
  
  if (error) throw error;
  return data;
};

export const deleteConnection = async (userId: string) => {
  // Delete both rows involved in the relationship.
  // Checking both user_id and partner_id ensures we clean up the bidirectional link
  // regardless of which user initiates the deletion.
  const { error } = await supabase
    .from('connections')
    .delete()
    .or(`user_id.eq.${userId},partner_id.eq.${userId}`);
  
  if (error) throw error;
};

// Wishes
export const getTodaysWishes = async (userId: string, partnerId: string) => {
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Filter for today (Local Time) since standard RLS returns all
  const today = new Date().toDateString();
  return (data || []).filter((w: Wish) => new Date(w.created_at).toDateString() === today);
};

export const getPairWishes = async (userId: string, partnerId: string) => {
  const { data, error } = await supabase
    .from('wishes')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const sendWish = async (senderId: string, receiverId: string, content: string) => {
  const { data, error } = await supabase
    .from('wishes')
    .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleWishCompletion = async (wishId: string, currentStatus: boolean) => {
  const { data, error } = await supabase
    .from('wishes')
    .update({ is_completed: !currentStatus })
    .eq('id', wishId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteWish = async (wishId: string) => {
  // RLS typically ensures users can only delete their own wishes
  const { error } = await supabase.from('wishes').delete().eq('id', wishId);
  if (error) throw error;
};

// Admin
export const getAllProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data;
};

export const deleteAllWishes = async () => {
    // Attempt to delete all. Note: RLS might restrict this if not admin.
    const { error } = await supabase.from('wishes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if(error) throw error;
}

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if(error) throw error;
    return data;
}