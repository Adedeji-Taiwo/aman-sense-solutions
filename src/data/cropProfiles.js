export const cropProfiles = {
  Tomato: {
    name: "Tomato",
    waterDemand: "High",
    optimalMoistureRange: {
      min: 40,
      max: 65,
    },
    baseDurationMinutes: 45,
    estimatedLitersPerHaPerMinute: 18,
    growthStageMultipliers: {
      Seedling: 0.7,
      Vegetative: 1.0,
      Flowering: 1.25,
      Fruiting: 1.35,
      Maturity: 0.85,
    },
  },

  Citrus: {
    name: "Citrus",
    waterDemand: "Medium-High",
    optimalMoistureRange: {
      min: 35,
      max: 60,
    },
    baseDurationMinutes: 55,
    estimatedLitersPerHaPerMinute: 22,
    growthStageMultipliers: {
      Seedling: 0.75,
      Vegetative: 1.0,
      Flowering: 1.15,
      Fruiting: 1.3,
      Maturity: 0.9,
    },
  },

  Wheat: {
    name: "Wheat",
    waterDemand: "Medium",
    optimalMoistureRange: {
      min: 30,
      max: 55,
    },
    baseDurationMinutes: 35,
    estimatedLitersPerHaPerMinute: 14,
    growthStageMultipliers: {
      Seedling: 0.8,
      Vegetative: 1.0,
      Flowering: 1.2,
      Fruiting: 1.1,
      Maturity: 0.75,
    },
  },

  Maize: {
    name: "Maize",
    waterDemand: "High",
    optimalMoistureRange: {
      min: 38,
      max: 63,
    },
    baseDurationMinutes: 50,
    estimatedLitersPerHaPerMinute: 20,
    growthStageMultipliers: {
      Seedling: 0.75,
      Vegetative: 1.1,
      Flowering: 1.35,
      Fruiting: 1.25,
      Maturity: 0.85,
    },
  },

  Olive: {
    name: "Olive",
    waterDemand: "Low-Medium",
    optimalMoistureRange: {
      min: 25,
      max: 50,
    },
    baseDurationMinutes: 30,
    estimatedLitersPerHaPerMinute: 10,
    growthStageMultipliers: {
      Seedling: 0.8,
      Vegetative: 1.0,
      Flowering: 1.1,
      Fruiting: 1.2,
      Maturity: 0.75,
    },
  },
};

export const defaultCropProfile = cropProfiles.Tomato;
