import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useMqttTelemetry } from "../context/MqttTelemetryContext";
import {
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import { calculateIrrigationRecommendation } from "../services/irrigationEngine";
import { Header, SearchBox, FarmProfileCard } from "../components";
import * as Location from "expo-location";
import DetailsForm from "../components/DetailsForm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { formattedDate } from "../functions/dateFormat";
import { lookUp } from "../data/lookUp";
import { field } from "../data/field";
import { getFarmProfile } from "../services/farmStorage";

const USE_MOCK_WEATHER = true;

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { telemetry, connectionStatus } = useMqttTelemetry();

  const [farmProfile, setFarmProfile] = useState(null);
  const [farmProfileLoading, setFarmProfileLoading] = useState(true);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState("");
  const [city, setCity] = useState("");

  const openWeatherAPIKey = process.env.EXPO_PUBLIC_OPENWEATHER;
  const degreeSymbol = "\u00B0";

  const irrigationRecommendation = useMemo(() => {
    if (farmProfileLoading) {
      return {
        status: "loading",
        title: "Loading farm profile",
        action: "Loading...",
        priority: "Loading",
        priorityColor: "#6b7280",
        reason: "Aman Sense is loading your farm profile.",
        suggestedDurationMinutes: 0,
        estimatedWaterLiters: 0,
        moistureRangeText: "Loading",
      };
    }

    return calculateIrrigationRecommendation({
      farmProfile,
      telemetry,
    });
  }, [farmProfile, telemetry, farmProfileLoading]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser !== null) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadFarmProfile = async () => {
      try {
        setFarmProfileLoading(true);

        const storedFarmProfile = await getFarmProfile();
        setFarmProfile(storedFarmProfile);
      } catch (error) {
        console.error("Error loading farm profile:", error);
        setFarmProfile(null);
      } finally {
        setFarmProfileLoading(false);
      }
    };

    if (isFocused) {
      loadFarmProfile();
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        const regionName = await Location.reverseGeocodeAsync({
          longitude: currentLocation.coords.longitude,
          latitude: currentLocation.coords.latitude,
        });

        setCity(regionName);
      } catch (error) {
        console.error("Location error:", error);
      }
    };

    fetchLocation();
  }, []);

  //obtain forecast for today and tomorrow from api
 useEffect(() => {
    const fetchWeatherData = async () => {
      if (
        !location?.coords?.latitude ||
        !location?.coords?.longitude
      ) {
        return;
      }

      if (!openWeatherAPIKey) {
        console.log("Missing OpenWeather API key");
        return;
      }

      try {
        const { latitude, longitude } = location.coords;

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPIKey}&units=metric`,
        );

        setWeatherData(response.data);
      } catch (error) {
        console.log(
          "Weather API error:",
          error?.response?.data || error.message,
        );
        setWeatherData(null);
      }
    };

    fetchWeatherData();
  }, [location, openWeatherAPIKey]);
  

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/onbarding/onboardingbg.png")}
        resizeMode="cover"
        className="bg-primary flex-1"
      >
        <View className="pt-8 shadow-sm z-20">
          <Header name={user?.fullName?.split(" ")[0]} />
          <SearchBox />
        </View>

        <ScrollView className="w-full bg-white h-screen px-5 -mt-9 rounded-t-2xl shadow-xl">
          <View className="pt-14 pb-4">
            <Text className="text-base font-mSemiBold">
              Weather Forecast
            </Text>
          </View>

          {!weatherData ? (
            <ActivityIndicator size="large" color="#3f926a" />
          ) : (
            <View
              className="w-full rounded-2xl shadow-2xl border border-1 border-gray-300 p-3 relative z-20"
              style={{
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 3 },
                shadowOpacity: 0.5,
                elevation: 3,
              }}
            >
              <View className="flex-row justify-between items-center w-full z-30">
                <View className="flex-row gap-2 items-center">
                  <Feather
                    name="calendar"
                    size={24}
                    color="#3f926a"
                  />

                  <Text className="text-xs font-mSemiBold text-gray-400">
                    {formattedDate}
                  </Text>
                </View>

                <View className="bg-primary rounded-lg items-center justify-center p-2 text-sm">
                  <Text className="text-white text-[10px] font-mRegular">
                    {weatherData?.weather?.[0]?.description}
                  </Text>
                </View>
              </View>

              <View className="justify-start items-center flex-row gap-2 my-2 z-30">
                <View>
                  <Text className="text-xl font-mBold font-bold text-black">
                    {`${weatherData?.main?.temp?.toFixed(1)}${degreeSymbol}C`}
                  </Text>
                </View>

                <View className="bg-black w-[3px] h-7" />

                <View>
                  <View className="gap-3 flex-row">
                    <Text className="text-xs font-mSemiBold font-semibold text-black">
                      H
                    </Text>

                    <Text className="text-xs font-mSemiBold font-semibold text-black">
                      {`${weatherData?.main?.temp_max?.toFixed(1)}`}
                    </Text>
                  </View>

                  <View className="gap-3 flex-row">
                    <Text className="text-xs font-mSemiBold font-semibold text-black">
                      L
                    </Text>

                    <Text className="text-xs font-mSemiBold font-semibold text-black">
                      {`${weatherData?.main?.temp_min?.toFixed(1)}`}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="z-30">
                <Text className="text-[11px] font-mSemiBold text-gray-400">
                  {city?.[0]?.city || "Current location"}
                  {city?.[0]?.region ? `, ${city[0].region}` : ""}
                </Text>

                <Text className="text-[11px] font-mSemiBold text-gray-400">
                  Humidity: {weatherData?.main?.humidity}%
                </Text>
              </View>

              <ImageBackground
                source={require("../../assets/home/cloud.png")}
                resizeMode="cover"
                className="flex justify-start bg-transparent z-10"
                style={{
                  height: 120,
                  width: 200,
                  position: "absolute",
                  top: 30,
                  right: 10,
                }}
              />
            </View>
          )}

          <View className="w-full mt-8">
            <View className="pb-4">
              <Text className="text-base font-mSemiBold">
                Farm Profile
              </Text>
            </View>

            <FarmProfileCard
              farmProfile={farmProfile}
              onPress={() => navigation.navigate("FarmProfile")}
            />
          </View>

          <View className="w-full mt-8">
            <View className="pb-4">
              <Text className="text-base font-mSemiBold">
                IoT Sensor Overview
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("SensorDashboard")}
              className="w-full rounded-2xl border border-primary bg-[#f3fbf7] px-4 py-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-mSemiBold text-black">
                    Aman Sense MQTT Sensor
                  </Text>

                  <Text className="text-xs font-mRegular text-gray-500 mt-1">
                    Status: {connectionStatus}
                  </Text>
                </View>

                <View
                  className={
                    connectionStatus === "connected"
                      ? "h-3 w-3 rounded-full bg-primary"
                      : "h-3 w-3 rounded-full bg-orange-400"
                  }
                />
              </View>

              {!telemetry ? (
                <Text className="text-xs font-mRegular text-gray-500 mt-4">
                  Waiting for live MQTT telemetry...
                </Text>
              ) : (
                <View className="mt-4">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-xs font-mRegular text-gray-500">
                        Soil Moisture
                      </Text>

                      <Text className="text-2xl font-mBold text-primary mt-1">
                        {telemetry.soilMoisturePercent}%
                      </Text>
                    </View>

                    <View>
                      <Text className="text-xs font-mRegular text-gray-500 text-right">
                        Raw ADC
                      </Text>

                      <Text className="text-xl font-mBold text-black mt-1 text-right">
                        {telemetry.rawSoilMoisture}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 rounded-xl bg-white px-3 py-3">
                    <Text className="text-xs font-mSemiBold text-black">
                      Moisture Status: {telemetry.moistureStatus}
                    </Text>

                    <Text className="text-[11px] font-mRegular text-gray-500 mt-1">
                      Device: {telemetry.deviceId}
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="w-full mt-8">
            <View className="pb-4">
              <Text className="text-base font-mSemiBold">
                Smart Irrigation
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("IrrigationRecommendation")
              }
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                    <Image
                      source={require("../../assets/irrigation/recommendation.png")}
                      className="h-8 w-8"
                      resizeMode="contain"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-mSemiBold text-black">
                      {irrigationRecommendation.action}
                    </Text>

                    <Text className="text-xs font-mRegular text-gray-500 mt-1">
                      {irrigationRecommendation.title}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor:
                      irrigationRecommendation.priorityColor,
                  }}
                  className="px-3 py-2 rounded-full"
                >
                  <Text className="text-white text-xs font-mSemiBold">
                    {irrigationRecommendation.priority}
                  </Text>
                </View>
              </View>

              <View className="mt-4 rounded-xl bg-[#f3fbf7] px-3 py-3">
                <View className="flex-row items-center">
                  <Image
                    source={require("../../assets/irrigation/timer.png")}
                    className="h-8 w-8 mr-3"
                    resizeMode="contain"
                  />

                  <View>
                    <Text className="text-xs font-mRegular text-gray-500">
                      Suggested Duration
                    </Text>

                    <Text className="text-lg font-mBold text-black mt-1">
                      {
                        irrigationRecommendation.suggestedDurationMinutes
                      }{" "}
                      minutes
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-full mt-8">
            <View className="pb-4">
              <Text className="text-base font-mSemiBold">
                Pump Control
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("PumpControl")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                    <Image
                      source={require("../../assets/pump/pump.png")}
                      className="h-8 w-8"
                      resizeMode="contain"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-mSemiBold text-black">
                      Virtual Irrigation Pump
                    </Text>

                    <Text className="text-xs font-mRegular text-gray-500 mt-1">
                      Status: {telemetry?.pumpStatus || "OFF"}
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-3 py-2 rounded-full ${
                    telemetry?.pumpStatus === "ON"
                      ? "bg-primary"
                      : "bg-gray-400"
                  }`}
                >
                  <Text className="text-white text-xs font-mSemiBold">
                    {telemetry?.pumpStatus || "OFF"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-full mt-8">
            <View className="pb-4">
              <Text className="text-base font-mSemiBold">
                Irrigation Analytics
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("IrrigationHistory")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                    <Image
                      source={require("../../assets/irrigation/irrigation.png")}
                      className="h-8 w-8"
                      resizeMode="contain"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-mSemiBold text-black">
                      View Irrigation Charts
                    </Text>

                    <Text className="text-xs font-mRegular text-gray-500 mt-1">
                      Analyze soil moisture trends, pump duration, and
                      irrigation events.
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-full mt-8">
            <View className="pb-4">
              <Text className="text-base font-mSemiBold">
                Crop Growth
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("CropGrowth")}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="h-12 w-12 rounded-full bg-[#f3fbf7] items-center justify-center mr-3">
                    <Image
                      source={require("../../assets/growth/crop-growth.png")}
                      className="h-8 w-8"
                      resizeMode="contain"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-mSemiBold text-black">
                      Track Crop Development
                    </Text>

                    <Text className="text-xs font-mRegular text-gray-500 mt-1">
                      Estimate growth progress using GDD and live IoT
                      temperature telemetry.
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-full">
            <View className="pt-8 pb-4">
              <Text className="text-base font-mSemiBold">
                Top Look - Up
              </Text>
            </View>

            <View className="py-1 gap-y-3 gap-x-2 flex-row items-center flex-wrap">
              {lookUp.map((item) => (
                <View
                  key={item.id}
                  className="flex-row gap-2 items-start bg-[#e3e3e3] rounded-3xl py-2 px-3 inline w-fit"
                >
                  <Text className="text-[11px] font-mSemiBold text-black text-left">
                    {item?.title}
                  </Text>

                  {item.icon}
                </View>
              ))}
            </View>
          </View>

          <View className="w-full mb-5">
            <View className="pt-8 pb-4">
              <Text className="text-base font-mSemiBold">
                Field Activities
              </Text>
            </View>

            <View className="py-1 gap-y-3 gap-x-2 flex-row items-stretch flex-wrap">
              {field.map((item) => (
                <View
                  key={item.id}
                  className={`px-1 py-2 w-[30%] gap-4 inline rounded-2xl shadow-2xl border border-1 ${
                    item.id === 1
                      ? "border-primary"
                      : "border-gray-300"
                  }`}
                >
                  {item.img}

                  <Text className="text-[11px] font-mSemiBold text-black text-left self-start">
                    {item?.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {showPopup && <DetailsForm setShowPopup={setShowPopup} />}
    </View>
  );
};

export default HomeScreen;
