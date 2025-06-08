// Supabase connection disabled - using local state management
// This file is kept for reference but not used

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    updateUser: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    resetPasswordForEmail: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    resend: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    setSession: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
        single: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
        order: () => Promise.resolve({ data: [], error: new Error('Supabase disabled') }),
      }),
      order: () => Promise.resolve({ data: [], error: new Error('Supabase disabled') }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
      }),
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    }),
  }),
};