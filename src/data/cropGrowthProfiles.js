export const cropGrowthProfiles = {
  Tomato: {
    crop: "Tomato",
    baseTemperature: 10,
    requiredGDD: 1200,
    typicalMaturityDays: 90,
    description:
      "Tomato growth is highly sensitive to temperature and water availability, especially during flowering and fruiting.",
  },

  Citrus: {
    crop: "Citrus",
    baseTemperature: 12,
    requiredGDD: 2200,
    typicalMaturityDays: 180,
    description:
      "Citrus is a perennial crop. GDD estimates are used here as a simplified crop-development indicator.",
  },

  Wheat: {
    crop: "Wheat",
    baseTemperature: 5,
    requiredGDD: 1400,
    typicalMaturityDays: 120,
    description:
      "Wheat development depends strongly on accumulated heat units during vegetative and reproductive stages.",
  },

  Maize: {
    crop: "Maize",
    baseTemperature: 10,
    requiredGDD: 1500,
    typicalMaturityDays: 110,
    description:
      "Maize uses heat accumulation patterns to estimate development toward maturity.",
  },

  Olive: {
    crop: "Olive",
    baseTemperature: 7,
    requiredGDD: 1900,
    typicalMaturityDays: 180,
    description:
      "Olive is a perennial crop. This prototype uses GDD as a simplified seasonal growth indicator.",
  },
};

export const defaultCropGrowthProfile = cropGrowthProfiles.Tomato;
