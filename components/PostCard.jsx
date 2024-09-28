import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { theme } from "../constants/theme";
import Avatar from "./Avatar";
import { hp } from "../helpers/common";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import Icon from "../assets/icons";
import { getSupabaseFileUrl } from "../services/imageService";
import { Image } from "expo-image";
import { Video } from "expo-av";

const PostCard = ({ item, currentUser, hasShadow = true }) => {
  const router = useRouter();
  // console.log("item=========", item);
  const shadowStyle = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 0.6,
    elevation: 1,
  };
  const createdAt = moment(item?.created_at).format("MMM D");
  const like = false;
  const likes = [];
  const openPostDetails = () => {};
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            rounded={theme.radius.md}
            uri={item?.user?.image}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.userName}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={hp(3.4)}
            strokeWidth={3}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        {/* <View style={styles.userInfo}></View> */}
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          <Text>{item.body}</Text>
        </View>
        {item?.file && item?.file.includes("postImage") && (
          <Image
            transition={100}
            source={getSupabaseFileUrl(item?.file)}
            style={styles.postMedia}
          />
        )}
        {item?.file && item?.file.includes("postVideos") && (
          <Video
            source={getSupabaseFileUrl(item?.file)}
            style={[styles.postMedia, { height: hp(30) }]}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
      </View>
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon
              name="heart"
              color={like ? theme.colors.roseLight : theme.colors.textLight}
              fill={like ? theme.colors.roseLight : "transparent"}
            />
          </TouchableOpacity>
          <Text>{likes.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="comment" color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text>{likes.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="share" color={theme.colors.textLight} />
          </TouchableOpacity>
          {/* <Text>{likes.length}</Text> */}
        </View>
      </View>
      {/* <Text>{item.body}</Text> */}
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // borderColor: "red",
    // borderWidth: 1,
  },
  userInfo: {
    flexDirection: "row",
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
