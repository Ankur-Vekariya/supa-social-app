import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";
import Icon from "../assets/icons";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import { theme } from "../constants/theme";
import Input from "../components/Input";
import Button from "../components/Button";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

const login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }
    setLoading(true);
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(error);

    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton />
        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back,</Text>
        </View>

        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please login to continue
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your mail"}
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your password"}
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Text style={styles.forgotPassword}>Forgot password</Text>
          <Button
            title="Login"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={onSubmit}
            loading={loading}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
            <Pressable
              onPress={() => {
                router.push("signUp");
              }}
            >
              <Text
                style={[
                  styles.footerText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Sign up
              </Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    fontSize: hp(1.5),
    color: theme.colors.text,
  },
});
