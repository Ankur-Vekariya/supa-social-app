import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import Loading from "../components/Loading";

const index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Loading />
    </View>
    // <ScreenWrapper>
    //   <Text>index</Text>
    //   <Button title="welcome" onPress={() => router.push("welcome")} />
    //  </ScreenWrapper>
  );
};

export default index;
