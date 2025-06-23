import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, UserProfile, signIn, signOut, getUserProfile } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userType: 'student' | 'donor' | 'admin',
    username?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
////////////////////////////////////////////////////////////////////
  
/////////////////////////////////////////////////////////////////////
const loadUserProfile = async (userId: string) => {
  console.log('Fetching profile for', userId);
  try {
    const userProfile = await getUserProfile(userId);
    console.log('Profile loaded:', userProfile);
    setProfile(userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error loading user profile:', error);
    setProfile(null);
    return null;
  }
};


  
////////////////////////////////////////////////////////////////////
  // ✅ FIX: Load session from localStorage and subscribe to changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // Get session from Supabase (restores from localStorage)
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await loadUserProfile(currentUser.id);
      }

      setLoading(false); // ✅ Done loading auth state
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', _event);
        setSession(session);

        const newUser = session?.user ?? null;
        setUser(newUser);

        if (newUser) {
          await loadUserProfile(newUser.id);
        } else {
          setProfile(null);
        }

        setLoading(false); // in case user logged out or in
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser } = await signIn(email, password);
      // session will be handled by the listener
    } catch (error) {
      if (error instanceof Error && error.message.includes('Email not confirmed')) {
        throw new Error('Please confirm your email address. Check your inbox for a verification link.');
      }
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userType: 'student' | 'donor' | 'admin',
    username?: string
  ) => {
    try {
      if (userType === 'student' && username) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .maybeSingle();

        if (existingUser) {
          throw new Error('Username already exists');
        }
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const profileData: Omit<UserProfile, 'created_at' | 'updated_at'> = {
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
          username: userType === 'student' ? username : undefined,
        };

        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error('Failed to create user profile');
        }

        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setSession(null);
      setUser(null);
      setProfile(null);

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });

      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(updatedProfile);
  };

  const isAuthenticated = !!session?.user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      login,
      signup,
      logout,
      isAuthenticated,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
