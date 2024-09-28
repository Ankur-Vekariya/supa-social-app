import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file === "object") {
      let isImage = post?.file?.type === "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("File upload", error, data);
      return { success: false, message: "Could not create post on supabase" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("Create post", error);
    return { success: false, message: "Could not create post" };
  }
};

export const fetchPost = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*,user:users (id,name,image)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.log("fetch products", error, data);
      return { success: false, message: "Could not fetch post on supabase" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch post", error);
    return { success: false, message: "Could not fetch post" };
  }
};
