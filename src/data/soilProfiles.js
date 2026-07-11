export const soilProfiles = {
  Sandy: {
    name: "Sandy",
    description:
      "Drains quickly and usually needs shorter, more frequent irrigation.",
    irrigationMultiplier: 1.2,
    retention: "Low",
  },

  Loamy: {
    name: "Loamy",
    description: "Balanced soil with moderate water retention.",
    irrigationMultiplier: 1.0,
    retention: "Medium",
  },

  Clay: {
    name: "Clay",
    description:
      "Holds water longer and should be irrigated carefully to avoid saturation.",
    irrigationMultiplier: 0.75,
    retention: "High",
  },

  Silty: {
    name: "Silty",
    description:
      "Retains moisture better than sandy soil but can compact easily.",
    irrigationMultiplier: 0.9,
    retention: "Medium-High",
  },
};

export const defaultSoilProfile = soilProfiles.Loamy;
