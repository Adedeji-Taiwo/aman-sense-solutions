import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  BarChart,
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import {
  buildMoistureTrendData,
  buildPumpDurationData,
  clearIrrigationHistory,
  getIrrigationHistory,
  summarizeIrrigationHistory,
} from "../services/irrigationHistoryStorage";
import { useMqttTelemetry } from "../context/MqttTelemetryContext";

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

const formatTime = (dateString) => {
  if (!dateString) {
    return "--";
  }

  return new Date(dateString).toLocaleString();
};

const StatCard = ({ title, value, icon, accent = "text-black" }) => {
  return (
    <View className="w-[48%] rounded-2xl bg-white border border-gray-200 p-4 mb-3">
      <Image source={icon} className="h-7 w-7 mb-3" resizeMode="contain" />

      <Text className="text-xs text-gray-500 font-mRegular">{title}</Text>

      <Text className={`text-2xl font-mBold mt-1 ${accent}`}>{value}</Text>
    </View>
  );
};

const EmptyChart = ({ title, subtitle }) => {
  return (
    <View className="rounded-2xl bg-white border border-gray-200 p-5 mb-5">
      <Text className="text-base font-mSemiBold text-black">{title}</Text>

      <Text className="text-xs font-mRegular text-gray-500 mt-2 leading-5">
        {subtitle}
      </Text>
    </View>
  );
};

const IrrigationHistoryScreen = () => {
  const { goBack } = useNavigation();
  const isFocused = useIsFocused();
  const { telemetry, pumpStatus } = useMqttTelemetry();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await getIrrigationHistory();
      setHistory(storedHistory);
    };

    if (isFocused) {
      loadHistory();
    }
  }, [isFocused, pumpStatus]);

  const summary = useMemo(() => {
    return summarizeIrrigationHistory(history);
  }, [history]);

  const moistureTrendData = useMemo(() => {
    return buildMoistureTrendData(history);
  }, [history]);

  const pumpDurationData = useMemo(() => {
    return buildPumpDurationData(history);
  }, [history]);

  const currentMoisture = Number(telemetry?.soilMoisturePercent || 0);
  const currentTank = Number(telemetry?.tankLevel || 0);

  const progressData = {
    labels: ["Moisture", "Tank"],
    data: [currentMoisture / 100, currentTank / 100],
  };

  const handleClearHistory = async () => {
    await clearIrrigationHistory();
    setHistory([]);
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
              source={require("../../assets/irrigation/irrigation.png")}
              className="h-8 w-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-dark_100 text-left text-[28px] tracking-wide leading-[34px] font-mBold flex-1">
            Irrigation Analytics
          </Text>
        </View>

        <Text className="text-dark_200/80 text-left text-sm leading-[22px] font-mRegular mt-2 mb-6">
          Visual history of pump activity, soil moisture response, and virtual irrigation records.
        </Text>

        <View className="flex-row flex-wrap justify-between mb-5">
          <StatCard
            title="Events"
            value={summary.totalEvents}
            icon={require("../../assets/irrigation/recommendation.png")}
          />

          <StatCard
            title="Pump Starts"
            value={summary.pumpStartEvents}
            icon={require("../../assets/pump/power-on.png")}
            accent="text-primary"
          />

          <StatCard
            title="Active Minutes"
            value={summary.totalActiveMinutes}
            icon={require("../../assets/irrigation/timer.png")}
          />

          <StatCard
            title="Est. Water"
            value={`${summary.totalEstimatedWaterLiters}L`}
            icon={require("../../assets/irrigation/water-drop.png")}
          />
        </View>

        <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
          <Text className="text-base font-mSemiBold text-black mb-2">
            Current Field Condition
          </Text>

          <ProgressChart
            data={progressData}
            width={screenWidth}
            height={190}
            strokeWidth={12}
            radius={28}
            chartConfig={chartConfig}
            hideLegend={false}
          />

          <Text className="text-[11px] text-gray-500 font-mRegular leading-5 mt-2">
            This chart compares current soil moisture and tank level as live MQTT telemetry values.
          </Text>
        </View>

        {moistureTrendData ? (
          <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
            <Text className="text-base font-mSemiBold text-black mb-3">
              Soil Moisture Trend
            </Text>

            <LineChart
              data={moistureTrendData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              yAxisSuffix="%"
              style={{
                borderRadius: 16,
              }}
            />

            <Text className="text-[11px] text-gray-400 font-mRegular leading-5 mt-3">
              Moisture trend shows soil moisture snapshots captured during pump status events.
            </Text>
          </View>
        ) : (
          <EmptyChart
            title="Soil Moisture Trend"
            subtitle="Start or stop the virtual pump to begin collecting moisture snapshots for the line chart."
          />
        )}

        {pumpDurationData ? (
          <View className="rounded-2xl bg-white border border-gray-200 p-4 mb-5">
            <Text className="text-base font-mSemiBold text-black mb-3">
              Pump Duration Chart
            </Text>

            <BarChart
              data={pumpDurationData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              yAxisSuffix="m"
              fromZero
              showValuesOnTopOfBars
              style={{
                borderRadius: 16,
              }}
            />

            <Text className="text-[11px] text-gray-400 font-mRegular leading-5 mt-3">
              Bars represent estimated pump activity duration in minutes for recent irrigation events.
            </Text>
          </View>
        ) : (
          <EmptyChart
            title="Pump Duration Chart"
            subtitle="Pump duration bars will appear after irrigation events are recorded."
          />
        )}

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base font-mSemiBold text-black">
            Event Timeline
          </Text>

          <TouchableOpacity onPress={handleClearHistory}>
            <Text className="text-xs font-mSemiBold text-[#ef4444]">
              Clear History
            </Text>
          </TouchableOpacity>
        </View>

        {history.length === 0 ? (
          <View className="rounded-2xl bg-white border border-gray-200 p-5">
            <Text className="text-sm font-mSemiBold text-black">
              No irrigation events yet
            </Text>

            <Text className="text-xs font-mRegular text-gray-500 mt-2 leading-5">
              Start or stop the virtual pump to create irrigation records and unlock analytics charts.
            </Text>
          </View>
        ) : (
          history.map((event) => {
            const isOn = event.pumpStatus === "ON";

            return (
              <View
                key={event.id}
                className="rounded-2xl bg-white border border-gray-200 p-4 mb-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View
                      className={`h-12 w-12 rounded-full items-center justify-center mr-3 ${
                        isOn ? "bg-[#dcfce7]" : "bg-[#f3f4f6]"
                      }`}
                    >
                      <Image
                        source={
                          isOn
                            ? require("../../assets/pump/power-on.png")
                            : require("../../assets/pump/power-off.png")
                        }
                        className="h-8 w-8"
                        resizeMode="contain"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-mSemiBold text-black">
                        Pump {event.pumpStatus}
                      </Text>

                      <Text className="text-xs font-mRegular text-gray-500 mt-1">
                        {event.lastCommand}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`px-3 py-2 rounded-full ${
                      isOn ? "bg-primary" : "bg-gray-400"
                    }`}
                  >
                    <Text className="text-white text-xs font-mSemiBold">
                      {event.mode || "MANUAL"}
                    </Text>
                  </View>
                </View>

                <View className="mt-4 rounded-xl bg-[#f3fbf7] p-3">
                  <Text className="text-[11px] text-gray-500 font-mRegular">
                    Time
                  </Text>

                  <Text className="text-xs text-black font-mSemiBold mt-1">
                    {formatTime(event.timestamp || event.savedAt)}
                  </Text>
                </View>

                <View className="mt-3 flex-row justify-between">
                  <Text className="text-[11px] text-gray-500 font-mRegular">
                    Moisture:{" "}
                    {event.soilMoisturePercent !== undefined
                      ? `${event.soilMoisturePercent}%`
                      : "--"}
                  </Text>

                  <Text className="text-[11px] text-gray-500 font-mRegular">
                    Duration: {event.activeDurationSeconds || 0}s
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default IrrigationHistoryScreen;