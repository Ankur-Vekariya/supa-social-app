import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { router } from "expo-router";
import Avatar from "../../components/Avatar";

const Home = () => {
  const { setAuth, user } = useAuth();
  const signOut = () => {
    setAuth(null);
    const { error } = supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", error.message);
    }
  };
  return (
    <ScreenWrapper bg="white">
      {/* <Text>Home</Text> */}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Supa Social</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("notifications")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokWidth={3}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokWidth={3}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
              {/* <Icon name="user" size={hp(3.2)} strokWidth={3} color={theme.colors.text}/> */}
            </Pressable>
          </View>
        </View>
      </View>
      <Button title="Log out" onPress={signOut} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
