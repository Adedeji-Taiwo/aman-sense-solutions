import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

export const lookUp = [
  {
    id: 1,
    title: "Soil Preparation",
    icon: (
      <FontAwesome5
        name="hand-holding-medical"
        size={20}
        color="#3f926a"
      />
    ),
  },
  {
    id: 2,
    title: "Harvest Planning",
    icon: (
      <MaterialIcons name="agriculture" size={20} color="#3f926a" />
    ),
  },
  {
    id: 3,
    title: "Watering",
    icon: (
      <FontAwesome6
        name="hand-holding-droplet"
        size={18}
        color="#3f926a"
      />
    ),
  },
  {
    id: 4,
    title: "Disorder",
    icon: <FontAwesome6 name="disease" size={18} color="#3f926a" />,
  },
  {
    id: 5,
    title: "Fertilizer",
    icon: (
      <MaterialIcons name="difference" size={18} color="#3f926a" />
    ),
  },
];
