import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // 1. Get the current active session (Persists across refreshes!)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserRole(session?.user?.user_metadata?.role || 'client');
      setLoading(false);
    });

    // 2. Listen for logouts or session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserRole(session?.user?.user_metadata?.role || 'client');
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen w-full bg-black text-white flex items-center justify-center">Loading...</div>;

  // If no session exists (Logged out), send them to login
  if (!session) return <Navigate to="/login" replace />;

  // If they try to access a route that doesn't match their role, send them away
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  // If they pass all checks, show them the dashboard!
  return children;
};

export default ProtectedRoute;