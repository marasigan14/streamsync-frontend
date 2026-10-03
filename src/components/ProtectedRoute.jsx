import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

const VALID_ROLES = ["client", "staff", "admin"];

// app_metadata can only be written by the server (unlike user_metadata)
const getRole = (session) => {
  const role = (session?.user?.app_metadata?.role || "client").toLowerCase();
  return VALID_ROLES.includes(role) ? role : "client";
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState("client");
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUserRole(getRole(session));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserRole(getRole(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );

  if (!session) return <Navigate to="/login" replace />;

  if (allowedRole && userRole !== allowedRole) {
    // Exception: clients may view the client pages
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