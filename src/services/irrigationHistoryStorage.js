import AsyncStorage from "@react-native-async-storage/async-storage";

const IRRIGATION_HISTORY_KEY = "irrigationHistory";

export const getIrrigationHistory = async () => {
  try {
    const storedHistory = await AsyncStorage.getItem(
      IRRIGATION_HISTORY_KEY,
    );

    if (!storedHistory) {
      return [];
    }

    return JSON.parse(storedHistory);
  } catch (error) {
    console.error("Error fetching irrigation history:", error);
    return [];
  }
};

export const saveIrrigationEvent = async (event) => {
  try {
    const currentHistory = await getIrrigationHistory();

    const nextEvent = {
      id: `${Date.now()}`,
      ...event,
      savedAt: new Date().toISOString(),
    };

    const updatedHistory = [nextEvent, ...currentHistory].slice(
      0,
      80,
    );

    await AsyncStorage.setItem(
      IRRIGATION_HISTORY_KEY,
      JSON.stringify(updatedHistory),
    );

    return nextEvent;
  } catch (error) {
    console.error("Error saving irrigation event:", error);
    throw error;
  }
};

export const clearIrrigationHistory = async () => {
  try {
    await AsyncStorage.removeItem(IRRIGATION_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing irrigation history:", error);
    throw error;
  }
};

export const summarizeIrrigationHistory = (history = []) => {
  const totalEvents = history.length;

  const pumpStartEvents = history.filter(
    (event) =>
      event.pumpStatus === "ON" ||
      event.lastCommand === "START_IRRIGATION",
  );

  const stoppedEvents = history.filter(
    (event) =>
      event.pumpStatus === "OFF" &&
      (event.lastCommand === "STOP_IRRIGATION" ||
        event.lastCommand === "AUTO_STOP_AFTER_DURATION"),
  );

  const modeEvents = history.filter(
    (event) => event.lastCommand === "SET_MODE",
  );

  const totalActiveSeconds = history.reduce((total, event) => {
    const seconds = Number(event.activeDurationSeconds || 0);
    return total + seconds;
  }, 0);

  const totalEstimatedWaterLiters = history.reduce((total, event) => {
    const liters = Number(event.estimatedWaterLiters || 0);
    return total + liters;
  }, 0);

  return {
    totalEvents,
    pumpStartEvents: pumpStartEvents.length,
    stoppedEvents: stoppedEvents.length,
    modeEvents: modeEvents.length,
    totalActiveMinutes: Math.round(totalActiveSeconds / 60),
    totalEstimatedWaterLiters: Math.round(totalEstimatedWaterLiters),
  };
};

export const buildMoistureTrendData = (history = []) => {
  const eventsWithMoisture = history
    .filter((event) => event.soilMoisturePercent !== undefined)
    .slice(0, 6)
    .reverse();

  if (eventsWithMoisture.length === 0) {
    return null;
  }

  return {
    labels: eventsWithMoisture.map((_, index) => `${index + 1}`),
    datasets: [
      {
        data: eventsWithMoisture.map((event) =>
          Number(event.soilMoisturePercent || 0),
        ),
      },
    ],
  };
};

export const buildPumpDurationData = (history = []) => {
  const eventsWithDuration = history
    .filter(
      (event) =>
        event.lastCommand === "START_IRRIGATION" ||
        event.lastCommand === "AUTO_STOP_AFTER_DURATION" ||
        event.activeDurationSeconds > 0,
    )
    .slice(0, 6)
    .reverse();

  if (eventsWithDuration.length === 0) {
    return null;
  }

  return {
    labels: eventsWithDuration.map((_, index) => `${index + 1}`),
    datasets: [
      {
        data: eventsWithDuration.map((event) =>
          Math.max(
            Math.round(Number(event.activeDurationSeconds || 0) / 60),
            1,
          ),
        ),
      },
    ],
  };
};
