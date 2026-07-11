import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Input, Button } from "../components";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

const ForgotPasswordScreen = () => {
  const { goBack, navigate } = useNavigation();
  const [forgotPassword, setForgotPassword] = useState("");
  const toast = useToast();

  //handle account validation before proceeding to next screen
  const handleAccount = () => {
    if (forgotPassword === "") {
      toast.show("Email address cannot be empty!", {
        type: "warning",
      });
    } else if (!forgotPassword.includes("@")) {
      toast.show("Invalid format!", {
        type: "warning",
      });
    } else {
      navigate("ValidateAccount");
      setForgotPassword("");
    }
  };

  return (
    <View className="flex-1 justify-start items-start px-6 pt-[98px] bg-light_100 relative">
      {/*upper left Background img*/}
      <Image
        source={require("../../assets/auth/blob-high.png")}
        className="h-[200px] w-[214px] absolute -top-12 left-12 -rotate-45"
      />

      <TouchableOpacity onPress={goBack}>
        <Image
          source={require("../../assets/auth/arrow-back.png")}
          className="h-[24px] w-[24px]"
        />
      </TouchableOpacity>

      <View className="mt-4 mb-6">
        <View className="items-start mb-3">
          <Text className="text-dark_100 text-left text-[28px] capitalize tracking-wide leading-[34px] font-dmBold">
            Password Recovery
          </Text>
        </View>
      </View>
      <Input
        title="Please enter your Aman sense email address"
        placeholder="Enter email address"
        inputMode="email"
        className="mt-10 text-white text-lg font-mBold font-extrabold"
        value={forgotPassword}
        onChangeText={(text) => setForgotPassword(text)}
      />
      <Button
        onPress={handleAccount}
        text="Continue"
        classNameButton="bg-primary mt-10"
        classNameText=" text-white"
      />

      {/*lower right Background img*/}
      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default ForgotPasswordScreen;
