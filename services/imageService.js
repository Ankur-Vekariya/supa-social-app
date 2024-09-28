import { decode } from "base64-arraybuffer";
import { supabaseURL } from "../constants";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";

export const getUserImageSource = (imagePath) => {
  if (imagePath) {
    return { uri: imagePath };
  } else {
    return require("../assets/images/welcome.png");
  }
};

export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `${supabaseURL}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    let fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);
    let { data, error } = await supabase
      .storage
      .from("uploads")
      .upload(fileName, imageData, {
        contentType: isImage ? "image/*" : "video/*",
        cachesControl: "3600",
        upsert: false,
      });
    if (error) {
      console.log("File upload", error);
      return { success: false, message: "Could not upload media on supabase" };
    }
    return { success: true, data: data.path };
  } catch (error) {
    console.log("File upload", error);
    return { success: false, message: "Could not upload media" };
  }
};

export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
