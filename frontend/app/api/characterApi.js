import client from "./client";

export const generateCharacter = async (imageUri, userId, token) => {
  const formData = new FormData();

  // 1. 이미지 파일 정보 설정
  // react-native-image-picker에서 받은 uri를 파일 객체로 변환
  const filename = imageUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  formData.append("image", {
    uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
    name: filename,
    type: type,
  });

  // 2. userId 추가 (팀원분 요청대로 일단 포함!)
  formData.append("userId", userId);

  try {
    const response = await client.post("/api/chracters/generate", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // 이미지 전송 필수 헤더
      },
    });
    return response.data; // { data: { characterUrl: "..." } } 반환
  } catch (error) {
    console.error("캐릭터 생성 API 에러:", error);
    throw error;
  }
};
