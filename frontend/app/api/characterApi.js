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

  try {
    const response = await client.post("/api/characters/generate", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    });
    return response.data;
  } catch (error) {
    const apiBody = error?.response?.data;
    console.error(
      "캐릭터 생성 API 에러:",
      error?.response?.status,
      apiBody?.code,
      apiBody?.message,
      error?.message,
    );
    throw error;
  }
};

export const getMyCharacterImages = async (token) => {
  try {
    const response = await client.get("/api/characters/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("캐릭터 이미지 목록 API 에러:", error);
    throw error;
  }
};

export const selectMyCharacterImage = async (imageUrl, token) => {
  try {
    const response = await client.patch(
      "/api/characters/me/profile",
      { imageUrl },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error("프로필 캐릭터 선택 API 에러:", error);
    throw error;
  }
};
