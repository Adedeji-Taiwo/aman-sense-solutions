import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMqttTelemetry } from "../context/MqttTelemetryContext";


const SensorDashboardScreen = () => {
  const { goBack } = useNavigation();
const { telemetry, connectionStatus, lastError } = useMqttTelemetry();
 



  const getStatusColor = (status) => {
    if (status === "connected") return "#3f926a";
    if (status === "reconnecting") return "#f59e0b";
    if (status === "error") return "#ef4444";
    return "#6b7280";
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

        <Text className="text-dark_100 text-left text-[28px] tracking-wide leading-[34px] font-mBold">
          MQTT IoT Sensors
        </Text>

        <Text className="text-dark_200/50 text-left text-sm leading-[22px] font-mRegular mt-2 mb-6">
          Live telemetry from the soil moisture sensor.
        </Text>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-500 font-mRegular">
                MQTT Status
              </Text>

              <Text
                style={{ color: getStatusColor(connectionStatus) }}
                className="text-base font-mSemiBold mt-1 capitalize"
              >
                {connectionStatus}
              </Text>
            </View>

            <View
              style={{ backgroundColor: getStatusColor(connectionStatus) }}
              className="h-3 w-3 rounded-full"
            />
          </View>

          {lastError ? (
            <Text className="text-[11px] text-red-500 font-mRegular mt-2 hidden">
              {lastError}
            </Text>
          ) : null}
        </View>

        {!telemetry ? (
          <View className="rounded-2xl bg-white border border-gray-200 p-5 items-center justify-center">
            <ActivityIndicator size="large" color="#3f926a" />

            <Text className="text-sm text-gray-500 font-mRegular mt-4 text-center">
              Waiting for MQTT telemetry from Python virtual device...
            </Text>
          </View>
        ) : (
          <>
            <View className="rounded-2xl bg-[#f3fbf7] border border-primary p-4 mb-5">
              <Text className="text-xs text-gray-500 font-mRegular">
                Device
              </Text>

              <Text className="text-base text-black font-mSemiBold mt-1">
                {telemetry.deviceId}
              </Text>

              <Text className="text-xs text-gray-500 font-mRegular mt-1">
                {telemetry.sensorType}
              </Text>
            </View>

            <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs text-gray-500 font-mRegular">
                    Raw Soil Moisture
                  </Text>

                  <Text className="text-3xl text-black font-mBold mt-1">
                    {telemetry.rawSoilMoisture}
                  </Text>

                  <Text className="text-xs text-gray-400 font-mRegular">
                    ADC Range: {telemetry.adcRange}
                  </Text>
                </View>

                <Image
                  source={require("../../assets/iot/soil-moisture.png")}
                  className="h-14 w-14"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs text-gray-500 font-mRegular">
                    Converted Moisture
                  </Text>

                  <Text className="text-3xl text-primary font-mBold mt-1">
                    {telemetry.soilMoisturePercent}%
                  </Text>

                  <Text className="text-sm text-gray-500 font-mSemiBold mt-2">
                    Status: {telemetry.moistureStatus}
                  </Text>
                </View>

                <MaterialIcons name="water-drop" size={40} color="#3f926a" />
              </View>
            </View>

            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] rounded-2xl bg-white border border-gray-200 p-4 mb-4">
                <Image
                  source={require("../../assets/iot/temperature.png")}
                  className="h-8 w-8 mb-3"
                  resizeMode="contain"
                />

                <Text className="text-xs text-gray-500 font-mRegular">
                  Soil Temp
                </Text>

                <Text className="text-lg text-black font-mBold mt-1">
                  {telemetry.soilTemperature}°C
                </Text>
              </View>

              <View className="w-[48%] rounded-2xl bg-white border border-gray-200 p-4 mb-4">
                <Image
                  source={require("../../assets/iot/humidity.png")}
                  className="h-8 w-8 mb-3"
                  resizeMode="contain"
                />

                <Text className="text-xs text-gray-500 font-mRegular">
                  Humidity
                </Text>

                <Text className="text-lg text-black font-mBold mt-1">
                  {telemetry.airHumidity}%
                </Text>
              </View>

              <View className="w-[48%] rounded-2xl bg-white border border-gray-200 p-4 mb-4">
                <Image
                  source={require("../../assets/iot/water-tank.png")}
                  className="h-8 w-8 mb-3"
                  resizeMode="contain"
                />

                <Text className="text-xs text-gray-500 font-mRegular">
                  Tank Level
                </Text>

                <Text className="text-lg text-black font-mBold mt-1">
                  {telemetry.tankLevel}%
                </Text>
              </View>

              <View className="w-[48%] rounded-2xl bg-white border border-gray-200 p-4 mb-4">
                <MaterialIcons name="schedule" size={30} color="#3f926a" />

                <Text className="text-xs text-gray-500 font-mRegular mt-3">
                  Last Sync
                </Text>

                <Text className="text-xs text-black font-mSemiBold mt-1">
                  {new Date(telemetry.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>

            <View className="rounded-2xl bg-white border border-gray-200 p-4 mt-1">
              <Text className="text-base text-black font-mSemiBold mb-2">
                Virtual IoT Architecture
              </Text>

              <Text className="text-xs text-gray-500 font-mRegular leading-5">
                Aman Sense receives MQTT telemetry from a Python virtual IoT
                device connected to CounterFit virtual hardware. The raw soil
                moisture value is read from a simulated Grove capacitive soil
                moisture sensor through an ADC-style reading.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default SensorDashboardScreen;