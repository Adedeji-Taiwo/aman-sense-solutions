import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useToast } from "react-native-toast-notifications";
import { Button } from "../components";
import { getFarmProfile, saveFarmProfile } from "../services/farmStorage";

const initialFarmProfile = {
  farmName: "",
  cropType: "",
  soilType: "",
  plotSizeHa: "",
  growthStage: "",
  irrigationMethod: "",
};

const FarmProfileScreen = () => {
  const { goBack } = useNavigation();
  const toast = useToast();

  const [farmProfile, setFarmProfile] = useState(initialFarmProfile);

  useEffect(() => {
    const loadFarmProfile = async () => {
      try {
        const storedProfile = await getFarmProfile();

        if (storedProfile) {
          setFarmProfile({
            farmName: storedProfile.farmName || "",
            cropType: storedProfile.cropType || "",
            soilType: storedProfile.soilType || "",
            plotSizeHa:
              storedProfile.plotSizeHa !== undefined &&
              storedProfile.plotSizeHa !== null
                ? String(storedProfile.plotSizeHa)
                : "",
            growthStage: storedProfile.growthStage || "",
            irrigationMethod: storedProfile.irrigationMethod || "",
          });
        }
      } catch (error) {
        console.error("Error loading farm profile:", error);
      }
    };

    loadFarmProfile();
  }, []);

const updateField = (fieldName, fieldValue) => {
  setFarmProfile((prevProfile) => {
    const nextProfile = { ...prevProfile };
    nextProfile[fieldName] = fieldValue;
    return nextProfile;
  });
};

  const handleSave = async () => {
    if (!farmProfile.farmName.trim()) {
      toast.show("Farm name is required.", { type: "warning" });
      return;
    }

    if (!farmProfile.cropType) {
      toast.show("Please select crop type.", { type: "warning" });
      return;
    }

    if (!farmProfile.soilType) {
      toast.show("Please select soil type.", { type: "warning" });
      return;
    }

    if (!farmProfile.plotSizeHa || Number(farmProfile.plotSizeHa) <= 0) {
      toast.show("Please enter a valid plot size.", {
        type: "warning",
      });
      return;
    }

    if (!farmProfile.growthStage) {
      toast.show("Please select growth stage.", { type: "warning" });
      return;
    }

    if (!farmProfile.irrigationMethod) {
      toast.show("Please select irrigation method.", {
        type: "warning",
      });
      return;
    }

    try {
      const profileToSave = {
        ...farmProfile,
        farmName: farmProfile.farmName.trim(),
        plotSizeHa: Number(farmProfile.plotSizeHa),
      };

      await saveFarmProfile(profileToSave);

      toast.show("Farm profile saved successfully.", {
        type: "success",
      });

      goBack();
    } catch (error) {
      console.error("Farm profile save error:", error);

      toast.show("Unable to save farm profile. Please try again.", {
        type: "danger",
      });
    }
  };

  return (
    <View className="flex-1 bg-light_100 pt-[70px] relative">
      <Image
        source={require("../../assets/auth/blob-high.png")}
        className="h-[200px] w-[214px] absolute -top-12 left-12 -rotate-45"
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
      >
        <TouchableOpacity onPress={goBack} className="mb-6">
          <Image
            source={require("../../assets/auth/arrow-back.png")}
            className="h-[24px] w-[24px]"
          />
        </TouchableOpacity>

        <Text className="text-dark_100 text-left text-[28px] tracking-wide leading-[34px] font-mBold">
          Farm Profile
        </Text>

        <Text className="text-dark_200/50 text-left text-sm leading-[22px] font-mRegular mt-2 mb-8">
          Add your farm details so Aman Sense can generate crop-specific
          irrigation recommendations.
        </Text>

        <View className="mb-5">
          <Text className="text-dark_400 text-base font-mRegular mb-2">
            Farm Name
          </Text>

          <TextInput
            className="px-5 py-[15px] border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] text-dark_500 font-mRegular rounded-lg w-full"
            placeholder="Example: Rhamna Demo Farm"
            placeholderTextColor="#9a9999"
            value={farmProfile.farmName}
            onChangeText={(text) => updateField("farmName", text)}
          />
        </View>

        <View className="mb-5">
          <Text className="text-dark_400 text-base font-mRegular mb-2">
            Crop Type
          </Text>

          <View className="border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] rounded-lg">
            <Picker
              selectedValue={farmProfile.cropType}
              onValueChange={(value) => updateField("cropType", value)}
            >
              <Picker.Item label="Select crop type" value="" />
              <Picker.Item label="Tomato" value="Tomato" />
              <Picker.Item label="Citrus" value="Citrus" />
              <Picker.Item label="Wheat" value="Wheat" />
              <Picker.Item label="Maize" value="Maize" />
              <Picker.Item label="Olive" value="Olive" />
            </Picker>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-dark_400 text-base font-mRegular mb-2">
            Soil Type
          </Text>

          <View className="border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] rounded-lg">
            <Picker
              selectedValue={farmProfile.soilType}
              onValueChange={(value) => updateField("soilType", value)}
            >
              <Picker.Item label="Select soil type" value="" />
              <Picker.Item label="Sandy" value="Sandy" />
              <Picker.Item label="Loamy" value="Loamy" />
              <Picker.Item label="Clay" value="Clay" />
              <Picker.Item label="Silty" value="Silty" />
            </Picker>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-dark_400 text-base font-mRegular mb-2">
            Plot Size
          </Text>

          <TextInput
            className="px-5 py-[15px] border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] text-dark_500 font-mRegular rounded-lg w-full"
            placeholder="Enter plot size in hectares"
            placeholderTextColor="#9a9999"
            keyboardType="numeric"
            value={farmProfile.plotSizeHa}
            onChangeText={(text) => updateField("plotSizeHa", text)}
          />
        </View>

        <View className="mb-5">
          <Text className="text-dark_400 text-base font-mRegular mb-2">
            Growth Stage
          </Text>

          <View className="border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] rounded-lg">
            <Picker
              selectedValue={farmProfile.growthStage}
              onValueChange={(value) => updateField("growthStage", value)}
            >
              <Picker.Item label="Select growth stage" value="" />
              <Picker.Item label="Seedling" value="Seedling" />
              <Picker.Item label="Vegetative" value="Vegetative" />
              <Picker.Item label="Flowering" value="Flowering" />
              <Picker.Item label="Fruiting" value="Fruiting" />
              <Picker.Item label="Maturity" value="Maturity" />
            </Picker>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-dark_400 text-base font-mRegular mb-2">
            Irrigation Method
          </Text>

          <View className="border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] rounded-lg">
            <Picker
              selectedValue={farmProfile.irrigationMethod}
              onValueChange={(value) =>
                updateField("irrigationMethod", value)
              }
            >
              <Picker.Item label="Select irrigation method" value="" />
              <Picker.Item label="Drip" value="Drip" />
              <Picker.Item label="Sprinkler" value="Sprinkler" />
              <Picker.Item label="Surface" value="Surface" />
              <Picker.Item label="Manual" value="Manual" />
            </Picker>
          </View>
        </View>

        <Button
          onPress={handleSave}
          text="Save Farm Profile"
          classNameButton="bg-primary"
          classNameText="text-white"
        />
      </ScrollView>

      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default FarmProfileScreen;