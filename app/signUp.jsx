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

const SignUp = () => {

//   create fu nction public.handle_new_user()
// returns trigger
// language plpgsql
// security definer set search_path = public
// as $$
// begin 
//   insert into public.users (id, name)
//   values(new.id,new.raw_user_meta_data->>'name');
//   return new;
// end;
// $$;

// create trigger createAuthUser
//  after insert on auth.users
//  for each row execute procedure public.handle_new_user();

  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }
    setLoading(true);
    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
          name
        }
      }
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton />
        <View>
          <Text style={styles.welcomeText}>Let's,</Text>
          <Text style={styles.welcomeText}>Get started,</Text>
        </View>

        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please enter the details to create account
          </Text>
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your name"}
            onChangeText={(value) => (nameRef.current = value)}
          />
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your email"}
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your password"}
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Button
            title="Sign Up"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={onSubmit}
            loading={loading}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?
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
                Login
              </Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

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
