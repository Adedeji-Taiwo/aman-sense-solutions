import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Input, Button } from "../components";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";

const LoginScreen = () => {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [securePassword, setSecurePassword] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] =
    useState(false);
  const [fingerprint, setFingerprint] = useState(false);
  /*const [LoginData, setLoginData] = useState({
        email: '',
        password: '',
        keepLogged: true,
      });*/

  const [LoginData, setLoginData] = useState({
    email: "michael@test.com",
    password: "password123",
    keepLogged: true,
  });

  //check support on load for fingerprint or facial recognition by device
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      const enroll = await LocalAuthentication.isEnrolledAsync();
      if (enroll) {
        setFingerprint(true);
      }
    })();
  }, []);

  //finger print handler
  const handleBiometricAuth = async () => {
    try {
      const biometricAuth =
        await LocalAuthentication.authenticateAsync({
          promptMessage: "Login with Biometrics",
          disableDeviceFallback: true,
          cancelLabel: "Cancel",
        });
      if (biometricAuth.success) {
        navigate("Home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //face auth handler
  const handleFaceAuth = async () => {
    try {
      const faceAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Face ID",
        disableDeviceFallback: true,
        cancelLabel: "Cancel",
      });
      if (faceAuth.success) {
        navigate("Home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //handle account validation
  const handleAccount = () => {
    if (LoginData.email === "") {
      toast.show("email cannot be empty!", {
        type: "warning",
      });
    } else if (LoginData.password === "") {
      toast.show("Password cannot be empty!", {
        type: "warning",
      });
    } else {
      console.log(LoginData);
      navigate("Home");
    }
  };

  return (
    <View className="flex-1 bg-light_100 pt-[78px] relative">
      {/*background svg*/}
      <Image
        source={require("../../assets/auth/blob-high.png")}
        className="h-[200px] w-[214px] absolute -top-12 left-12 -rotate-45"
      />
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingHorizontal: 20,
          paddingBottom: 24,
          backgroundColor: "#fefefe",
          width: "100%",
        }}
      >
        <Image
          source={require("../../assets/language/logo2.png")}
          className="h-[65px] w-[250px]"
        />
        <View className="mt-7 mb-4 self-start">
          <Text className="text-dark_100 text-left text-[28px] capitalize tracking-wide leading-[34px] font-dmBold">
            Login
          </Text>
        </View>

        <Input
          title="Email Address"
          placeholder="Enter email address"
          inputMode="email"
          className="mt-10 self-start"
          value={LoginData.email}
          onChangeText={(text) =>
            setLoginData({ ...LoginData, email: text })
          }
        />

        <View className="relative w-full mt-6 self-start">
          <Input
            title="Password"
            placeholder="Enter password"
            inputMode="text"
            className=""
            secureTextEntry={securePassword}
            value={LoginData.password}
            onChangeText={(text) =>
              setLoginData({ ...LoginData, password: text })
            }
          />
          <TouchableOpacity
            onPress={() =>
              setSecurePassword((prevState) => !prevState)
            }
            className="absolute pl-4 right-0 top-[38px] w-14 py-5 z-30 rounded-r-lg"
          >
            <Image
              source={require("../../assets/account/show.png")}
              className="h-4 w-4"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-6 self-start flex-row justify-between items-center w-full">
          <TouchableOpacity
            className="flex-row gap-2"
            onPress={() =>
              setLoginData({
                ...LoginData,
                keepLogged: !LoginData.keepLogged,
              })
            }
          >
            <View
              className={`w-4 h-4 rounded border-primary border justify-center items-center ${LoginData.keepLogged ? "bg-primary" : "bg-transparent"}`}
            >
              {LoginData.keepLogged && (
                <Image
                  source={require("../../assets/account/check.png")}
                  className="h-[5px] w-[7px]"
                />
              )}
            </View>

            <View className="items-start justify-start">
              <Text className="text-dark_500 text-left text-xs font-dmRegular">
                Keep me signed in
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("ForgotPassword")}
          >
            <Text className="text-dark_400 text-right text-sm font-dmMedium">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          onPress={handleAccount}
          text="Login"
          classNameButton="bg-primary mt-20"
          classNameText=" text-white"
        />

        <View className="mt-7 flex-row justify-center self-center flex-grow">
          <Text className="text-dark_500 text-center text-xs font-dmRegular">
            Do not have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigate("CreateAccount")}>
            <Text className="text-primary text-center text-xs font-dmRegular">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/*conditionals for rendering print or facial based on device support*/}
        {isBiometricSupported && fingerprint ? (
          <TouchableOpacity onPress={handleBiometricAuth}>
            <Image
              source={require("../../assets/account/Fingerprint.png")}
              className="h-[100px] w-[100px] mt-8"
            />
          </TouchableOpacity>
        ) : (
          <View>
            <Text className="text-dark_200 text-center text-xs font-dmRegular">
              Fingerprint not supported/allocated
            </Text>
          </View>
        )}

        {isBiometricSupported && !fingerprint ? (
          <TouchableOpacity onPress={handleFaceAuth}>
            <Image
              source={require("../../assets/account/faceId.png")}
              className="h-[100px] w-[100px] mt-8"
            />
          </TouchableOpacity>
        ) : null}
      </ScrollView>
      {/*backgound svg */}
      <Image
        source={require("../../assets/auth/blob-low.png")}
        className="h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45"
      />
    </View>
  );
};

export default LoginScreen;
