import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeWindStyleSheet } from "nativewind";
import { View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { useFonts } from "expo-font";
import * as InitialScreen from "expo-splash-screen";
import { MqttTelemetryProvider } from "./src/context/MqttTelemetryContext";
import {
  SplashScreen,
  OnboardingOneScreen,
  OnboardingTwoScreen,
  OnboardingThreeScreen,
  LoginScreen,
  ValidateAccountScreen,
  CreateAccountScreen,
  ForgotPasswordScreen,
  LanguageScreen,
  HomeScreen,
  SuccessScreen,
  FarmProfileScreen,
  SensorDashboardScreen,
  IrrigationRecommendationScreen,
  PumpControlScreen,
  IrrigationHistoryScreen,
  CropGrowthScreen,
} from "./src/screens";

//required for tailwind styling
NativeWindStyleSheet.setOutput({
  default: "native",
});

//keeps splashscreen on while fonts load
InitialScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  //load font
  const [fontsLoaded] = useFonts({
    MBold: require("./assets/fonts/Montserrat Medium 500.ttf"),
    MRegular: require("./assets/fonts/Montserrat Regular 400.ttf"),
    MSemiBold: require("./assets/fonts/Montserrat SemiBold 600.ttf"),
  });

  //show splashscreen only when fonts are loaded
  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await InitialScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ToastProvider
      placement="top"
      duration={4000}
      animationType="slide-in"
      textStyle={{ fontSize: 14 }}
    >
      <View className="flex-1" onLayout={onLayoutRootView}>
        <MqttTelemetryProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {/*<Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                presentation: "fullScreenModal",
                headerShown: false,
              }}
            />*/}
              <Stack.Screen
                name="Language"
                component={LanguageScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OnboardingOne"
                component={OnboardingOneScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OnboardingTwo"
                component={OnboardingTwoScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="OnboardingThree"
                component={OnboardingThreeScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ValidateAccount"
                component={ValidateAccountScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CreateAccount"
                component={CreateAccountScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Success"
                component={SuccessScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="FarmProfile"
                component={FarmProfileScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SensorDashboard"
                component={SensorDashboardScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="IrrigationRecommendation"
                component={IrrigationRecommendationScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="PumpControl"
                component={PumpControlScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="IrrigationHistory"
                component={IrrigationHistoryScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CropGrowth"
                component={CropGrowthScreen}
                options={{
                  presentation: "fullScreenModal",
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </MqttTelemetryProvider>
      </View>
    </ToastProvider>
  );
}
