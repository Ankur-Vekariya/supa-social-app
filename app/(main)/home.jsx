import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { router } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPost } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";

var limit = 10;
const Home = () => {
  const { setAuth, user } = useAuth();

  const [post, setPost] = useState([]);

  const handlePostEvent = async (payload) => {
    console.log("payload========", payload);
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let user = await getUserData(newPost.userId);
      newPost.user = res.success ? res.data : {};
      setPost((prevPost) => [newPost, ...prevPost]);
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();
    getPost();
    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPost = async () => {
    limit += 10;
    let res = await fetchPost();
    if (res.success) {
      setPost(res.data);
    }
    // console.log("post----------", res);
    // console.log("post----------", res.data[0].user);
  };

  return (
    <ScreenWrapper bg="white">
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
        {/* post */}
        <FlatList
          data={post}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return <PostCard item={item} currentUser={user} />;
          }}
          ListFooterComponent={() => {
            return (
              <View style={{ marginVertical: post.length === 0 ? 200 : 30 }}>
                <Loading />
              </View>
            );
          }}
        />
      </View>
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
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
});
