import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getFarmProfile } from "../services/farmStorage";
import { useMqttTelemetry } from "../context/MqttTelemetryContext";
import { calculateIrrigationRecommendation } from "../services/irrigationEngine";

const InfoRow = ({ label, value }) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <Text className="text-xs font-mRegular text-gray-500">
        {label}
      </Text>
      <Text className="text-xs font-mSemiBold text-black">
        {value}
      </Text>
    </View>
  );
};

const getRecommendationIcon = (status) => {
  if (status === "optimal") {
    return require("../../assets/irrigation/check-circle.png");
  }

  if (status === "low_tank" || status === "overwatered") {
    return require("../../assets/irrigation/warning.png");
  }

  if (status === "irrigate") {
    return require("../../assets/irrigation/irrigation.png");
  }

  return require("../../assets/irrigation/recommendation.png");
};

const IrrigationRecommendationScreen = () => {
  const { goBack } = useNavigation();
  const { telemetry, connectionStatus } = useMqttTelemetry();

  const [farmProfile, setFarmProfile] = useState(null);

  useEffect(() => {
    const loadFarmProfile = async () => {
      const storedFarmProfile = await getFarmProfile();
      setFarmProfile(storedFarmProfile);
    };

    loadFarmProfile();
  }, []);

  const recommendation = calculateIrrigationRecommendation({
    farmProfile,
    telemetry,
  });

  const recommendationIcon = getRecommendationIcon(
    recommendation.status,
  );

  return (
    <View className="flex-1 bg-light_100 pt-[70px] relative">
      <Image
        source={require("../../assets/auth/blob-high.png")}
        className="h-[200px] w-[214px] absolute -top-12 left-12 -rotate-45"
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
      >
        <TouchableOpacity onPress={goBack} className="mb-6">
          <Image
            source={require("../../assets/auth/arrow-back.png")}
            className="h-6 w-6"
          />
        </TouchableOpacity>

        <View className="flex-row items-center mb-3">
          <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
            <Image
              source={require("../../assets/irrigation/recommendation.png")}
              className="h-9 w-9"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1">
            <Text className="text-dark_100 text-left text-2xl tracking-wide leading-[34px] font-mBold">
              Irrigation Recommendation
            </Text>
          </View>
        </View>

        <Text className="text-dark_200/80 text-left text-sm leading-[22px] font-mRegular mt-2 mb-6">
          Smart water guidance based on farm profile and live MQTT IoT
          telemetry.
        </Text>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="h-14 w-14 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                <Image
                  source={recommendationIcon}
                  className="h-9 w-9"
                  resizeMode="contain"
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-mRegular text-gray-600">
                  Recommendation
                </Text>

                <Text className="text-xl font-mBold text-black mt-1">
                  {recommendation.action}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: recommendation.priorityColor,
              }}
              className="px-3 py-2 rounded-full"
            >
              <Text className="text-white text-xs font-mSemiBold">
                {recommendation.priority}
              </Text>
            </View>
          </View>

          <View className="mt-5 rounded-xl bg-[#f3fbf7] p-4">
            <Text className="text-sm font-mSemiBold text-black">
              {recommendation.title}
            </Text>

            <Text className="text-xs font-mRegular text-gray-600 leading-5 mt-2">
              {recommendation.reason}
            </Text>
          </View>
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-3">
            Current Sensor Reading
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                <Image
                  source={require("../../assets/irrigation/water-drop.png")}
                  className="h-8 w-8"
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text className="text-xs font-mRegular text-gray-500">
                  Soil Moisture
                </Text>

                <Text className="text-3xl font-mBold text-primary mt-1">
                  {telemetry
                    ? `${telemetry.soilMoisturePercent}%`
                    : "--"}
                </Text>
              </View>
            </View>

            <View>
              <Text className="text-xs font-mRegular text-gray-500 text-right">
                MQTT Status
              </Text>

              <Text className="text-sm font-mSemiBold text-black mt-1 text-right">
                {connectionStatus}
              </Text>
            </View>
          </View>

          <InfoRow
            label="Raw ADC Reading"
            value={telemetry ? telemetry.rawSoilMoisture : "--"}
          />

          <InfoRow
            label="Target Moisture Range"
            value={recommendation.moistureRangeText}
          />

          <InfoRow
            label="Tank Level"
            value={telemetry ? `${telemetry.tankLevel}%` : "--"}
          />
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-3">
            Suggested Irrigation Plan
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 rounded-xl bg-[#f3fbf7] p-4 mr-2">
              <Image
                source={require("../../assets/irrigation/timer.png")}
                className="h-7 w-7"
                resizeMode="contain"
              />

              <Text className="text-xs text-gray-500 font-mRegular mt-3">
                Duration
              </Text>

              <Text className="text-lg text-black font-mBold mt-1">
                {recommendation.suggestedDurationMinutes} min
              </Text>
            </View>

            <View className="flex-1 rounded-xl bg-[#fff7ed] p-4 ml-2">
              <Image
                source={require("../../assets/irrigation/water-drop.png")}
                className="h-7 w-7"
                resizeMode="contain"
              />

              <Text className="text-xs text-gray-500 font-mRegular mt-3">
                Est. Water
              </Text>

              <Text className="text-lg text-black font-mBold mt-1">
                {recommendation.estimatedWaterLiters} L
              </Text>
            </View>
          </View>

          <Text className="text-[11px] font-mRegular text-gray-500 leading-5 mt-4">
            Estimated values are generated by the current rule-based
            prototype using crop type, soil type, growth stage, plot
            size, and live soil moisture telemetry.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("PumpControl")}
          className="bg-primary rounded-xl py-4 items-center justify-center mb-5"
        >
          <Text className="text-white text-sm font-mSemiBold">
            Open Pump Control
          </Text>
        </TouchableOpacity>

        {farmProfile && (
          <View className="rounded-2xl bg-white border border-gray-200 p-4">
            <View className="flex-row items-center mb-3">
              <View className="h-10 w-10 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                <Image
                  source={require("../../assets/irrigation/irrigation.png")}
                  className="h-7 w-7"
                  resizeMode="contain"
                />
              </View>

              <Text className="text-base font-mSemiBold text-black">
                Farm Context
              </Text>
            </View>

            <InfoRow label="Farm" value={farmProfile.farmName} />
            <InfoRow label="Crop" value={farmProfile.cropType} />
            <InfoRow label="Soil Type" value={farmProfile.soilType} />
            <InfoRow
              label="Growth Stage"
              value={farmProfile.growthStage}
            />
            <InfoRow
              label="Plot Size"
              value={`${farmProfile.plotSizeHa} ha`}
            />
          </View>
        )}
      </ScrollView>

      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default IrrigationRecommendationScreen;
