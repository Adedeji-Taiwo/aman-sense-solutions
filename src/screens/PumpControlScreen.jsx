import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useMqttTelemetry } from "../context/MqttTelemetryContext";
import { getFarmProfile } from "../services/farmStorage";
import { calculateIrrigationRecommendation } from "../services/irrigationEngine";
import { useEffect } from "react";

const PumpControlScreen = () => {
  const { goBack } = useNavigation();

  const {
    telemetry,
    pumpStatus,
    connectionStatus,
    sendPumpCommand,
  } = useMqttTelemetry();

  const [farmProfile, setFarmProfile] = useState(null);
  const [mode, setMode] = useState("MANUAL");

  useEffect(() => {
    const loadFarmProfile = async () => {
      const storedFarmProfile = await getFarmProfile();
      setFarmProfile(storedFarmProfile);
    };

    loadFarmProfile();
  }, []);

  const irrigationRecommendation = useMemo(() => {
    return calculateIrrigationRecommendation({
      farmProfile,
      telemetry,
    });
  }, [farmProfile, telemetry]);

  const suggestedDurationSeconds = Math.max(
    irrigationRecommendation.suggestedDurationMinutes * 60,
    10
  );

  const handleStartPump = () => {
    sendPumpCommand({
      command: "START_IRRIGATION",
      mode,
      durationSeconds: suggestedDurationSeconds,
      source: "Aman Sense Mobile App",
      timestamp: new Date().toISOString(),
    });
  };

  const handleStopPump = () => {
    sendPumpCommand({
      command: "STOP_IRRIGATION",
      mode,
      source: "Aman Sense Mobile App",
      timestamp: new Date().toISOString(),
    });
  };

  const handleSetMode = (nextMode) => {
    setMode(nextMode);

    sendPumpCommand({
      command: "SET_MODE",
      mode: nextMode,
      source: "Aman Sense Mobile App",
      timestamp: new Date().toISOString(),
    });
  };

  const currentPumpStatus = pumpStatus?.pumpStatus || telemetry?.pumpStatus || "OFF";
  const currentMode = pumpStatus?.mode || mode;

  const isPumpOn = currentPumpStatus === "ON";

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
              source={require("../../assets/pump/pump.png")}
              className="h-8 w-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-dark_100 text-left text-[28px] tracking-wide leading-[34px] font-mBold flex-1">
            Pump Control
          </Text>
        </View>

        <Text className="text-dark_200/80 text-left text-sm leading-[22px] font-mRegular mt-2 mb-6">
          Control the virtual relay-powered irrigation pump through MQTT commands.
        </Text>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={`h-16 w-16 rounded-full items-center justify-center mr-4 ${
                  isPumpOn ? "bg-[#dcfce7]" : "bg-[#f3f4f6]"
                }`}
              >
                <Image
                  source={
                    isPumpOn
                      ? require("../../assets/pump/power-on.png")
                      : require("../../assets/pump/power-off.png")
                  }
                  className="h-10 w-10"
                  resizeMode="contain"
                />
              </View>

              <View>
                <Text className="text-xs text-gray-500 font-mRegular">
                  Pump Status
                </Text>

                <Text
                  className={`text-3xl font-mBold mt-1 ${
                    isPumpOn ? "text-primary" : "text-gray-700"
                  }`}
                >
                  {currentPumpStatus}
                </Text>
              </View>
            </View>

            <View
              className={`px-3 py-2 rounded-full ${
                isPumpOn ? "bg-primary" : "bg-gray-400"
              }`}
            >
              <Text className="text-white text-xs font-mSemiBold">
                {currentMode}
              </Text>
            </View>
          </View>

          <Text className="text-[11px] text-gray-500 font-mRegular mt-4">
            MQTT Status: {connectionStatus}
          </Text>
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-4">
            Irrigation Mode
          </Text>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => handleSetMode("MANUAL")}
              className={`flex-1 rounded-xl p-4 mr-2 border ${
                mode === "MANUAL"
                  ? "bg-[#f3fbf7] border-primary"
                  : "bg-white border-gray-200"
              }`}
            >
              <Image
                source={require("../../assets/pump/manual-control.png")}
                className="h-8 w-8 mb-3"
                resizeMode="contain"
              />

              <Text className="text-sm font-mSemiBold text-black">
                Manual
              </Text>

              <Text className="text-[11px] text-gray-500 font-mRegular mt-1">
                User controls pump directly.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSetMode("AUTO")}
              className={`flex-1 rounded-xl p-4 ml-2 border ${
                mode === "AUTO"
                  ? "bg-[#f3fbf7] border-primary"
                  : "bg-white border-gray-200"
              }`}
            >
              <Image
                source={require("../../assets/pump/auto-mode.png")}
                className="h-8 w-8 mb-3"
                resizeMode="contain"
              />

              <Text className="text-sm font-mSemiBold text-black">
                Auto
              </Text>

              <Text className="text-[11px] text-gray-500 font-mRegular mt-1">
                Uses recommendation duration.
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-3">
            Suggested Action
          </Text>

          <View className="rounded-xl bg-[#f3fbf7] p-4 mb-4">
            <Text className="text-sm font-mSemiBold text-black">
              {irrigationRecommendation.action}
            </Text>

            <Text className="text-xs font-mRegular text-gray-500 mt-2 leading-5">
              {irrigationRecommendation.reason}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xs font-mRegular text-gray-500">
              Suggested Duration
            </Text>

            <Text className="text-sm font-mSemiBold text-black">
              {irrigationRecommendation.suggestedDurationMinutes} min
            </Text>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={handleStartPump}
              className="flex-1 bg-primary rounded-xl py-4 mr-2 items-center justify-center"
            >
              <Text className="text-white text-sm font-mSemiBold">
                Start Pump
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleStopPump}
              className="flex-1 bg-[#ef4444] rounded-xl py-4 ml-2 items-center justify-center"
            >
              <Text className="text-white text-sm font-mSemiBold">
                Stop Pump
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4">
          <Text className="text-base font-mSemiBold text-black mb-3">
            Actuator Telemetry
          </Text>

          <Text className="text-xs font-mRegular text-gray-500 mb-2">
            Actuator Type:{" "}
            {pumpStatus?.actuatorType || "Virtual Relay-Controlled Irrigation Pump"}
          </Text>

          <Text className="text-xs font-mRegular text-gray-500 mb-2">
            Last Command: {pumpStatus?.lastCommand || "NONE"}
          </Text>

          <Text className="text-xs font-mRegular text-gray-500 mb-2">
            Active Duration: {pumpStatus?.activeDurationSeconds || 0} sec
          </Text>

          <Text className="text-xs font-mRegular text-gray-500">
            Last Update:{" "}
            {pumpStatus?.timestamp
              ? new Date(pumpStatus.timestamp).toLocaleTimeString()
              : "--"}
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

export default PumpControlScreen;