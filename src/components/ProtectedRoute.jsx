import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // FIXED: Added .toLowerCase() to the initial load
      setUserRole((session?.user?.user_metadata?.role || "client").toLowerCase());
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserRole((session?.user?.user_metadata?.role || "client").toLowerCase());
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  // If no session exists, send to login
  if (!session) return <Navigate to="/login" replace />;

  // If role doesn't match, redirect them safely
  if (allowedRole && userRole !== allowedRole) {
    // SPECIAL EXCEPTION: If a client is trying to view client-related pages, let them through
    if (
      userRole === "client" &&
      (location.pathname === "/client-main" ||
        location.pathname === "/client/dashboard")
    ) {
      return children;
    }
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;