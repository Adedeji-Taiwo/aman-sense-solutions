import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import { useToast } from "react-native-toast-notifications";
import { getFarmProfile } from "../services/farmStorage";
import { useMqttTelemetry } from "../context/MqttTelemetryContext";
import {
  buildGDDProjectionData,
  calculateCropGrowth,
  getDefaultPlantingDateByStage,
} from "../services/gddCalculator";
import {
  getCropGrowthSettings,
  saveCropGrowthSettings,
} from "../services/cropGrowthStorage";

const screenWidth = Dimensions.get("window").width - 48;

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(63, 146, 106, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#3f926a",
  },
  propsForBackgroundLines: {
    strokeDasharray: "4",
    stroke: "#e5e7eb",
  },
};

const InfoRow = ({ label, value }) => {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <Text className="text-xs font-mRegular text-gray-500">{label}</Text>

      <Text className="text-xs font-mSemiBold text-black">{value}</Text>
    </View>
  );
};

const CropGrowthScreen = () => {
  const navigation = useNavigation();
  const { goBack } = navigation;
  const isFocused = useIsFocused();
  const toast = useToast();

  const { telemetry, connectionStatus } = useMqttTelemetry();

  const [farmProfile, setFarmProfile] = useState(null);
  const [plantingDate, setPlantingDate] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const storedFarmProfile = await getFarmProfile();
      setFarmProfile(storedFarmProfile);

      const storedSettings = await getCropGrowthSettings();

      if (storedSettings?.plantingDate) {
        setPlantingDate(storedSettings.plantingDate);
      } else {
        const defaultDate = getDefaultPlantingDateByStage(
          storedFarmProfile?.growthStage
        );

        setPlantingDate(defaultDate);
      }
    };

    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const growthResult = useMemo(() => {
    return calculateCropGrowth({
      farmProfile,
      telemetry,
      plantingDate,
    });
  }, [farmProfile, telemetry, plantingDate]);

  const gddProjectionData = useMemo(() => {
    return buildGDDProjectionData(growthResult);
  }, [growthResult]);

  const progressData = {
    labels: ["Growth"],
    data: [growthResult.progressPercent / 100],
  };

  const handleSavePlantingDate = async () => {
    if (!plantingDate || Number.isNaN(new Date(plantingDate).getTime())) {
      toast.show("Please enter a valid date in YYYY-MM-DD format.", {
        type: "warning",
      });
      return;
    }

    await saveCropGrowthSettings({
      plantingDate,
    });

    toast.show("Crop growth settings saved.", {
      type: "success",
    });
  };

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
            className="h-[24px] w-[24px]"
          />
        </TouchableOpacity>

        <View className="flex-row items-center mb-3">
          <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
            <Image
              source={require("../../assets/growth/crop-growth.png")}
              className="h-8 w-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-dark_100 text-left text-[28px] tracking-wide leading-[34px] font-mBold flex-1">
            Crop Growth
          </Text>
        </View>

        <Text className="text-dark_200/80 text-left text-sm leading-[22px] font-mRegular mt-2 mb-6">
          Estimate crop development using Growing Degree Days from live virtual IoT temperature telemetry.
        </Text>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="h-14 w-14 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                <Image
                  source={require("../../assets/growth/growth.png")}
                  className="h-10 w-10"
                  resizeMode="contain"
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-mRegular text-gray-500">
                  Growth Status
                </Text>

                <Text
                  style={{ color: growthResult.statusColor }}
                  className="text-xl font-mBold mt-1"
                >
                  {growthResult.status}
                </Text>
              </View>
            </View>

            <View
              style={{ backgroundColor: growthResult.statusColor }}
              className="px-3 py-2 rounded-full"
            >
              <Text className="text-white text-xs font-mSemiBold">
                {growthResult.progressPercent}%
              </Text>
            </View>
          </View>

          <Text className="text-xs text-gray-500 font-mRegular leading-5 mt-4">
            {growthResult.recommendation}
          </Text>
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-3">
            Crop Setup
          </Text>

          <View className="flex-row items-center mb-3">
            <View className="h-10 w-10 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
              <Image
                source={require("../../assets/growth/calendar.png")}
                className="h-7 w-7"
                resizeMode="contain"
              />
            </View>

            <View className="flex-1">
              <Text className="text-xs text-gray-500 font-mRegular mb-2">
                Planting Date
              </Text>

              <TextInput
                className="px-4 py-3 border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] text-dark_500 font-mRegular rounded-lg w-full"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9a9999"
                value={plantingDate}
                onChangeText={setPlantingDate}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSavePlantingDate}
            className="bg-primary rounded-xl py-4 items-center justify-center mt-2"
          >
            <Text className="text-white text-sm font-mSemiBold">
              Save Growth Settings
            </Text>
          </TouchableOpacity>
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-3">
            Growth Progress
          </Text>

          <ProgressChart
            data={progressData}
            width={screenWidth}
            height={190}
            strokeWidth={12}
            radius={36}
            chartConfig={chartConfig}
            hideLegend={false}
          />

          <Text className="text-[11px] text-gray-500 font-mRegular leading-5 mt-2">
            Progress is estimated from accumulated GDD compared with the crop’s required GDD.
          </Text>
        </View>

        {gddProjectionData && (
          <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
            <Text className="text-base font-mSemiBold text-black mb-3">
              GDD Development Curve
            </Text>

            <LineChart
              data={gddProjectionData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
              }}
            />

            <Text className="text-[11px] text-gray-500 font-mRegular leading-5 mt-3">
              The chart compares required crop heat units with the current estimated growth trajectory.
            </Text>
          </View>
        )}

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <View className="flex-row items-center mb-3">
            <View className="h-10 w-10 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
              <Image
                source={require("../../assets/growth/temperature.png")}
                className="h-7 w-7"
                resizeMode="contain"
              />
            </View>

            <Text className="text-base font-mSemiBold text-black">
              GDD Metrics
            </Text>
          </View>

          <InfoRow
            label="Crop"
            value={farmProfile?.cropType || growthResult.cropProfile.crop}
          />

          <InfoRow
            label="Base Temperature"
            value={`${growthResult.cropProfile.baseTemperature}°C`}
          />

          <InfoRow
            label="Live Temperature"
            value={`${growthResult.liveTemperature.toFixed(1)}°C`}
          />

          <InfoRow
            label="Estimated Min / Max"
            value={`${growthResult.estimatedMinTemperature}°C / ${growthResult.estimatedMaxTemperature}°C`}
          />

          <InfoRow label="Daily GDD" value={growthResult.dailyGDD} />

          <InfoRow
            label="Accumulated GDD"
            value={`${growthResult.accumulatedGDD} / ${growthResult.requiredGDD}`}
          />

          <InfoRow
            label="Days After Planting"
            value={`${growthResult.daysAfterPlanting} days`}
          />

          <InfoRow
            label="Estimated Days to Maturity"
            value={
              growthResult.estimatedDaysToMaturity !== null
                ? `${growthResult.estimatedDaysToMaturity} days`
                : "--"
            }
          />
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4">
          <View className="flex-row items-center mb-3">
            <View className="h-10 w-10 rounded-full bg-[#fff7ed] items-center justify-center mr-3">
              <Image
                source={require("../../assets/growth/harvest.png")}
                className="h-7 w-7"
                resizeMode="contain"
              />
            </View>

            <Text className="text-base font-mSemiBold text-black">
              Harvest Insight
            </Text>
          </View>

          <Text className="text-xs font-mRegular text-gray-500 leading-5">
            {growthResult.progressPercent >= 90
              ? "The crop is close to estimated maturity. Field inspection is recommended before harvest decisions."
              : `Based on the current GDD estimate, this crop still needs about ${growthResult.remainingGDD} GDD before reaching its configured maturity target.`}
          </Text>

          <Text className="text-[11px] text-gray-500 font-mRegular leading-5 mt-3">
            MQTT Status: {connectionStatus}. This is a prototype estimate and should be combined with field inspection and agronomic guidance.
          </Text>
        </View>
      </ScrollView>

      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default CropGrowthScreen;