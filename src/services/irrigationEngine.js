import {
  cropProfiles,
  defaultCropProfile,
} from "../data/cropProfiles";
import {
  soilProfiles,
  defaultSoilProfile,
} from "../data/soilProfiles";

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const getNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

export const calculateIrrigationRecommendation = ({
  farmProfile,
  telemetry,
}) => {
  if (!farmProfile) {
    return {
      status: "missing_farm",
      title: "Farm profile required",
      action: "Add Farm Profile",
      priority: "Setup Needed",
      priorityColor: "#f97316",
      reason:
        "Create a farm profile so Aman Sense can calculate crop-specific irrigation recommendations.",
      suggestedDurationMinutes: 0,
      estimatedWaterLiters: 0,
      moistureRangeText: "Not available",
    };
  }

  if (!telemetry) {
    return {
      status: "waiting_for_sensor",
      title: "Waiting for IoT telemetry",
      action: "Waiting for Sensor",
      priority: "Sensor Pending",
      priorityColor: "#f59e0b",
      reason:
        "Aman Sense is waiting for live MQTT telemetry from the CounterFit virtual soil moisture sensor.",
      suggestedDurationMinutes: 0,
      estimatedWaterLiters: 0,
      moistureRangeText: "Waiting for data",
    };
  }

  const cropProfile =
    cropProfiles[farmProfile.cropType] || defaultCropProfile;

  const soilProfile =
    soilProfiles[farmProfile.soilType] || defaultSoilProfile;

  const growthStage = farmProfile.growthStage || "Vegetative";
  const plotSizeHa = getNumber(farmProfile.plotSizeHa, 1);
  const soilMoisture = getNumber(telemetry.soilMoisturePercent, 0);
  const tankLevel = getNumber(telemetry.tankLevel, 100);

  const optimalMin = cropProfile.optimalMoistureRange.min;
  const optimalMax = cropProfile.optimalMoistureRange.max;

  const stageMultiplier =
    cropProfile.growthStageMultipliers[growthStage] || 1;

  const soilMultiplier = soilProfile.irrigationMultiplier || 1;

  const moistureRangeText = `${optimalMin}% - ${optimalMax}%`;

  if (tankLevel < 15) {
    return {
      status: "low_tank",
      title: "Water tank level is low",
      action: "Refill Tank Before Irrigation",
      priority: "Critical",
      priorityColor: "#ef4444",
      reason:
        "The water tank level is too low for safe irrigation. Refill the tank before starting irrigation.",
      suggestedDurationMinutes: 0,
      estimatedWaterLiters: 0,
      moistureRangeText,
      cropProfile,
      soilProfile,
    };
  }

  if (soilMoisture > optimalMax + 10) {
    return {
      status: "overwatered",
      title: "Soil moisture is too high",
      action: "Stop Irrigation",
      priority: "High",
      priorityColor: "#6366f1",
      reason: `${farmProfile.cropType} on ${farmProfile.soilType} soil is above the recommended moisture range. Additional irrigation may increase risk of overwatering.`,
      suggestedDurationMinutes: 0,
      estimatedWaterLiters: 0,
      moistureRangeText,
      cropProfile,
      soilProfile,
    };
  }

  if (soilMoisture >= optimalMin && soilMoisture <= optimalMax) {
    return {
      status: "optimal",
      title: "Soil moisture is optimal",
      action: "No Irrigation Needed",
      priority: "Normal",
      priorityColor: "#3f926a",
      reason: `${farmProfile.cropType} at ${growthStage} stage is currently within the recommended soil moisture range for ${farmProfile.soilType} soil.`,
      suggestedDurationMinutes: 0,
      estimatedWaterLiters: 0,
      moistureRangeText,
      cropProfile,
      soilProfile,
    };
  }

  if (soilMoisture > optimalMax) {
    return {
      status: "wet",
      title: "Soil is slightly wetter than needed",
      action: "Delay Irrigation",
      priority: "Low",
      priorityColor: "#3b82f6",
      reason: `Soil moisture is slightly above the recommended range. Aman Sense recommends delaying irrigation and monitoring the next sensor readings.`,
      suggestedDurationMinutes: 0,
      estimatedWaterLiters: 0,
      moistureRangeText,
      cropProfile,
      soilProfile,
    };
  }

  const moistureDeficit = optimalMin - soilMoisture;

  const durationFactor = clamp(moistureDeficit / 20, 0.35, 2.2);

  const suggestedDurationMinutes = Math.round(
    clamp(
      cropProfile.baseDurationMinutes *
        stageMultiplier *
        soilMultiplier *
        durationFactor,
      10,
      180,
    ),
  );

  const estimatedWaterLiters = Math.round(
    suggestedDurationMinutes *
      cropProfile.estimatedLitersPerHaPerMinute *
      plotSizeHa,
  );

  let priority = "Medium";
  let priorityColor = "#f59e0b";

  if (moistureDeficit >= 20) {
    priority = "High";
    priorityColor = "#ef4444";
  } else if (moistureDeficit < 8) {
    priority = "Low";
    priorityColor = "#3f926a";
  }

  return {
    status: "irrigate",
    title: "Irrigation recommended",
    action: "Irrigate Today",
    priority,
    priorityColor,
    reason: `${farmProfile.cropType} at ${growthStage} stage on ${farmProfile.soilType} soil is below the recommended moisture range. Aman Sense recommends irrigation based on live MQTT soil moisture telemetry.`,
    suggestedDurationMinutes,
    estimatedWaterLiters,
    moistureRangeText,
    cropProfile,
    soilProfile,
  };
};
