// Supabase functionality disabled - using local state instead
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    updateUser: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
        maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase disabled') }),
      }),
    }),
    insert: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    update: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: new Error('Supabase disabled') }),
    }),
  }),
};