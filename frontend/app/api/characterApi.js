import { Platform } from "react-native";
import client from "./client";

export const generateCharacter = async (imageUri, token) => {
  const formData = new FormData();

  const filename = imageUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  formData.append("image", {
    uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
    name: filename,
    type: type,
  });

  // ✅ [테스트용 강제 주입] 서버가 userId가 없다고 화내니까 일단 "1"을 넣어서 보냅니다.
  formData.append("userId", "1");

  try {
    const response = await client.post("/api/characters/generate", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("캐릭터 생성 API 에러:", error);
    throw error;
  }
};
