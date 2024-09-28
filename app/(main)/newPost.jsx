import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import Header from "../../components/Header";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import { TouchableOpacity } from "react-native";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { createOrUpdatePost } from "../../services/postService";
import { getSupabaseFileUrl } from "../../services/imageService";

const NewPost = () => {
  const { user } = useAuth();

  const postDetailRef = useRef("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    // console.log("---------------",result.assets[0].type);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };
  // console.log("file====", file);

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file === "object") {
      return true;
    }
    return false;
  };
  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }
    if (file.includes("postImages")) {
      return "image";
    }
    return "video";
  };

  const getFileUri = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      // console.log("file-------------------", file);

      return file.uri;
    }

    return getSupabaseFileUrl(file)?.uri;
  };

  const onSubmit = async () => {
    // console.log("postDetailRef",postDetailRef.current);
    if (!postDetailRef.current && !file) {
      Alert.alert("Post", "Please choose an image or write your thoughts");
      return;
    }

    let data = {
      file,
      body: postDetailRef.current,
      userId: user?.id,
    };
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    // console.log("res-----", res);
    if (res.success) {
      setFile(null);
      postDetailRef.current = "";
      router.back()
    } else {
      Alert.alert("Create post", "Something went wrong");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user && user?.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <Input
              icon={<Icon name="edit" size={26} strokeWidth={1.6} />}
              placeholder={"Enter your mail"}
              onChangeText={(value) => (postDetailRef.current = value)}
            />
          </View>
          {file && (
            <View style={styles.file}>
              {getFileType(file) == "video" ? (
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: getFileUri(file) }}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: getFileUri(file) }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              )}
              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={20} color="white" />
              </Pressable>
            </View>
          )}
          <View style={styles.media}>
            <Text style={styles.addImageText}>Add post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity
                onPress={() => {
                  onPick(true);
                }}
              >
                <Icon name="image" size={26} strokeWidth={1.6} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onPick(false);
                }}
              >
                <Icon name="video" size={30} strokeWidth={1.6} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          title="Create"
          buttonStyle={{ marginHorizontal: wp(3) }}
          onPress={onSubmit}
          loading={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {},
  publicText: {
    fontSize: hp(1.5),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {},
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  mediaIcons: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.roseLight,
  },
});
