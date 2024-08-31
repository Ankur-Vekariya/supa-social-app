import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("/home");
      } else {
        setAuth(null);
        router.push("/welcome");
      }
    });
  }, []);

  updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData(res.data);
    }
    console.log("user data response", res);
  };

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
