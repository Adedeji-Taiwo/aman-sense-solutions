import {
  cropGrowthProfiles,
  defaultCropGrowthProfile,
} from "../data/cropGrowthProfiles";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const formatDateInput = (date) => {
  return date.toISOString().split("T")[0];
};

export const getDefaultPlantingDateByStage = (growthStage) => {
  const today = new Date();

  const stageDays = {
    Seedling: 14,
    Vegetative: 35,
    Flowering: 60,
    Fruiting: 85,
    Maturity: 110,
  };

  const daysBack = stageDays[growthStage] || 35;
  const plantingDate = new Date(today);
  plantingDate.setDate(today.getDate() - daysBack);

  return formatDateInput(plantingDate);
};

export const getDaysAfterPlanting = (plantingDateText) => {
  if (!plantingDateText) {
    return 0;
  }

  const plantingDate = new Date(plantingDateText);
  const today = new Date();

  if (Number.isNaN(plantingDate.getTime())) {
    return 0;
  }

  return Math.max(Math.floor((today - plantingDate) / MS_PER_DAY), 0);
};

export const calculateDailyGDD = ({
  maxTemperature,
  minTemperature,
  baseTemperature,
}) => {
  const averageTemperature =
    (Number(maxTemperature || 0) + Number(minTemperature || 0)) / 2;

  const dailyGDD = averageTemperature - Number(baseTemperature || 0);

  return Number(Math.max(dailyGDD, 0).toFixed(1));
};

export const calculateCropGrowth = ({
  farmProfile,
  telemetry,
  plantingDate,
}) => {
  const cropType = farmProfile?.cropType || "Tomato";

  const cropProfile =
    cropGrowthProfiles[cropType] || defaultCropGrowthProfile;

  const liveTemperature =
    Number(telemetry?.airTemperature) ||
    Number(telemetry?.soilTemperature) ||
    25.6;

  const estimatedMaxTemperature = Number(
    (liveTemperature + 4).toFixed(1),
  );
  const estimatedMinTemperature = Number(
    (liveTemperature - 5).toFixed(1),
  );

  const dailyGDD = calculateDailyGDD({
    maxTemperature: estimatedMaxTemperature,
    minTemperature: estimatedMinTemperature,
    baseTemperature: cropProfile.baseTemperature,
  });

  const daysAfterPlanting = getDaysAfterPlanting(plantingDate);

  const accumulatedGDD = Number(
    (dailyGDD * daysAfterPlanting).toFixed(1),
  );

  const progressPercent = Number(
    clamp(
      (accumulatedGDD / cropProfile.requiredGDD) * 100,
      0,
      100,
    ).toFixed(1),
  );

  const remainingGDD = Math.max(
    Number((cropProfile.requiredGDD - accumulatedGDD).toFixed(1)),
    0,
  );

  const estimatedDaysToMaturity =
    dailyGDD > 0 ? Math.ceil(remainingGDD / dailyGDD) : null;

  let status = "Growing";
  let statusColor = "#3f926a";
  let recommendation =
    "Crop is progressing based on the current temperature-derived GDD estimate.";

  if (progressPercent < 25) {
    status = "Early Growth";
    statusColor = "#3b82f6";
    recommendation =
      "Crop is in early development. Maintain stable soil moisture and monitor stress indicators.";
  } else if (progressPercent < 60) {
    status = "Active Growth";
    statusColor = "#3f926a";
    recommendation =
      "Crop is actively developing. Keep irrigation consistent with crop and soil requirements.";
  } else if (progressPercent < 90) {
    status = "Approaching Maturity";
    statusColor = "#f97316";
    recommendation =
      "Crop is approaching maturity. Monitor water stress and prepare harvest planning.";
  } else {
    status = "Near / At Maturity";
    statusColor = "#7c3aed";
    recommendation =
      "Crop is near or at estimated maturity. Field inspection is recommended.";
  }

  return {
    cropProfile,
    liveTemperature,
    estimatedMaxTemperature,
    estimatedMinTemperature,
    dailyGDD,
    daysAfterPlanting,
    accumulatedGDD,
    requiredGDD: cropProfile.requiredGDD,
    remainingGDD,
    progressPercent,
    estimatedDaysToMaturity,
    status,
    statusColor,
    recommendation,
  };
};

export const buildGDDProjectionData = (growthResult) => {
  if (!growthResult) {
    return null;
  }

  const requiredGDD = growthResult.requiredGDD || 1;
  const accumulatedGDD = growthResult.accumulatedGDD || 0;
  const dailyGDD = growthResult.dailyGDD || 1;

  const points = [0, 25, 50, 75, 100];

  return {
    labels: ["0", "25", "50", "75", "100"],
    datasets: [
      {
        data: points.map((point) => {
          const projectedGDD = (requiredGDD * point) / 100;
          return Math.min(projectedGDD, requiredGDD);
        }),
      },
      {
        data: points.map((point) => {
          const projectedDay = Math.round(
            (growthResult.daysAfterPlanting * point) / 100,
          );

          const estimatedGDDAtPoint = projectedDay * dailyGDD;

          return Math.min(
            Math.max(
              estimatedGDDAtPoint,
              accumulatedGDD * (point / 100),
            ),
            requiredGDD,
          );
        }),
      },
    ],
  };
};
