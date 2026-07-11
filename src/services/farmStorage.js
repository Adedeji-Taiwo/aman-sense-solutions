import AsyncStorage from "@react-native-async-storage/async-storage";

const FARM_PROFILE_KEY = "farmProfile";

export const saveFarmProfile = async (farmProfile) => {
  try {
    const profileWithMeta = {
      ...farmProfile,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      FARM_PROFILE_KEY,
      JSON.stringify(profileWithMeta),
    );
    return profileWithMeta;
  } catch (error) {
    console.error("Error saving farm profile:", error);
    throw error;
  }
};

export const getFarmProfile = async () => {
  try {
    const storedProfile =
      await AsyncStorage.getItem(FARM_PROFILE_KEY);

    if (!storedProfile) {
      return null;
    }

    return JSON.parse(storedProfile);
  } catch (error) {
    console.error("Error fetching farm profile:", error);
    return null;
  }
};

export const deleteFarmProfile = async () => {
  try {
    await AsyncStorage.removeItem(FARM_PROFILE_KEY);
  } catch (error) {
    console.error("Error deleting farm profile:", error);
    throw error;
  }
};
