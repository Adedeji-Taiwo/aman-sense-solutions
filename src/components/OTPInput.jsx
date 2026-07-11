import { View } from "react-native";
import OTPTextInput from "react-native-otp-textinput";



const OTPInput = ({ inputCount, otp, setOTP, editable }) => {

    const handleOTPChange = (code) => {
      setOTP(code);
    };
  
    return (
      <View className="w-full">
        <OTPTextInput
          handleTextChange={handleOTPChange}
          inputCount={inputCount}
          tintColor="#2793EB"
          offTintColor="#bdbdbd"
          editable={editable}
        />
      </View>
    );
  };



  export default OTPInput;