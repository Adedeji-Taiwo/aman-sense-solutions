import AsyncStorage from "@react-native-async-storage/async-storage";

const CROP_GROWTH_SETTINGS_KEY = "cropGrowthSettings";

export const getCropGrowthSettings = async () => {
  try {
    const storedSettings = await AsyncStorage.getItem(
      CROP_GROWTH_SETTINGS_KEY,
    );

    if (!storedSettings) {
      return null;
    }

    return JSON.parse(storedSettings);
  } catch (error) {
    console.error("Error fetching crop growth settings:", error);
    return null;
  }
};

export const saveCropGrowthSettings = async (settings) => {
  try {
    const nextSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      CROP_GROWTH_SETTINGS_KEY,
      JSON.stringify(nextSettings),
    );

    return nextSettings;
  } catch (error) {
    console.error("Error saving crop growth settings:", error);
    throw error;
  }
};
