import { Image } from "react-native-animatable";

export const field = [
  {
    id: 1,
    title: "Irrigation Schedule",
    img: (
      <Image
        source={require("../../assets/home/icon6.png")}
        className="h-9 w-9 self-end"
      />
    ),
  },
  {
    id: 2,
    title: "Crop Monitoring",
    img: (
      <Image
        source={require("../../assets/home/icon1.png")}
        className="h-9 w-9 self-end"
      />
    ),
  },
  {
    id: 3,
    title: "Disorder Diagnosis",
    img: (
      <Image
        source={require("../../assets/home/icon2.png")}
        className="h-9 w-9 self-end"
      />
    ),
  },
  {
    id: 4,
    title: "Area Exploration",
    img: (
      <Image
        source={require("../../assets/home/icon3.png")}
        className="h-9 w-9 self-end"
      />
    ),
  },
  {
    id: 5,
    title: "Environment Status",
    img: (
      <Image
        source={require("../../assets/home/icon4.png")}
        className="h-9 w-9 self-end"
      />
    ),
  },
  {
    id: 6,
    title: "Fertilizer Application",
    img: (
      <Image
        source={require("../../assets/home/icon5.png")}
        className="h-9 w-9 self-end"
      />
    ),
  },
];
