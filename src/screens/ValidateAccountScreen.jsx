import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {CountDown, OTPInput, Button} from '../components/index'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import {useToast} from 'react-native-toast-notifications'



const ValidateAccountScreen = () => {
  const {navigate, goBack} = useNavigation();
  const isFocused = useIsFocused();
    const [otp, setOTP] = useState('');
    const toast = useToast();
   

  //auth before navigation to personals detail screen
    const handleNavigation = () => {
      if (otp.length !== 6 && isFocused) {
        toast.show('Incomplete OTP!', {
          type: 'warning',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
      else {
        toast.hideAll();
        navigate("Success");
      }
    }


  return (
    <View className="flex-1 justify-start items-start px-6 pt-[98px] bg-light_100 relative">
       <Image 
          source={require("../../assets/auth/blob-high.png")}
          className='h-[200px] w-[214px] absolute -top-12 left-12 -rotate-45'
        />

        <TouchableOpacity onPress={goBack}>
            <Image 
            source={require("../../assets/auth/arrow-back.png")}
            className='h-[24px] w-[24px]'
            />
        </TouchableOpacity>
      
        
       <View className='mt-4 mb-10'>
            <View className='items-start'>
            <Text className='text-dark_100 text-left text-[28px] capitalize tracking-wide leading-[34px] font-dmBold'>Submit OTP</Text>
            <Text className='text-dark_300 text-left text-sm leading-[22px] font-dmRegular mt-1'>Enter the OTP sent to 060******13</Text>
            </View>
       </View>


       <OTPInput 
          inputCount={6}
          setOTP={setOTP}
          otp={otp}
       />

       <CountDown 
        minutes={1}
        isFocused={isFocused}

       />

        <Button 
        onPress={handleNavigation}
        text='Continue'
        classNameButton='bg-primary mt-[60px]'
        classNameText=' text-white'
    />

    <View className='mt-7 flex-row justify-center self-center flex-grow'>
      <Text className='text-dark_500 text-center text-xs font-dmRegular'>I didn't receive code? </Text>
      <TouchableOpacity><Text className='text-primary text-center text-xs font-dmRegular'>Resend Code</Text></TouchableOpacity>
    </View>

    <View className='mt-7 flex-row justify-center self-center mb-[50px]'>
      <Text className='text-black opacity-60 text-center text-xs font-dmRegular'>Didn't get OTP? </Text>
      <TouchableOpacity><Text className='text-primary text-center text-xs font-dmRegular'>Contact Support</Text></TouchableOpacity>
    </View>

        <Image 
          source={require("../../assets/auth/blob-low.png")}
          className='h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45'
        />
    </View>
  )
}

export default ValidateAccountScreen