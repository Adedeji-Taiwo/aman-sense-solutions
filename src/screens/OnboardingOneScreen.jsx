import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import * as Animmatable from 'react-native-animatable';
import { Button } from '../components';
import {useNavigation} from '@react-navigation/native'



const OnboardingOneScreen = () => {
  const {navigate} = useNavigation();
  const [slide, setSlide] = useState(false);

  const handleNavigate = () => {
    setSlide(true);

    // Delay the function execution using setTimeout
    setTimeout(() => {
      navigate('OnboardingTwo');
    }, 300);
   

  }


 


  return (
    <View
      className="flex-1">
      <ImageBackground
        source={require("../../assets/onbarding/onboardingbg.png")}
        resizeMode="cover"
        className='bg-[#a8cdbb] flex-1'
      >
      <Animmatable.View
        animation={slide ? "fadeOutLeft" : ""} 
        duration={300}
        easing="ease-out"
      className='flex-1 relative items-center justify-center'>
      <Image 
          source={require("../../assets/onbarding/onboard1.png")}
          className='h-[300px] absolute top-12 w-full'
        />
      <View className='justify-start items-center bg-light_100 absolute bottom-0 w-full h-[447px] rounded-t-[40px] px-5 pt-[35px]'>
        <View className="flex-row items-start justify-center gap-2">
            <View className='w-[57px] h-1 rounded-3xl bg-primary'></View>
            <View  className='w-[57px] h-1 rounded-3xl bg-light_200'></View>
            <View  className='w-[57px] h-1 rounded-3xl bg-light_200'></View>
        </View>
        <View className='items-center gap-4 my-12'>
            <Text className='text-dark_100 text-center text-[24px] capitalize tracking-wide leading-[34px] font-mBold'>Enhance The Future of Farming with us...</Text>
            <Text className='text-dark_200 text-center text-sm leading-[22px] w-[284px] font-semibold font-mRegular'>Partner with our visionary approach to cultivate a greener and more resilient agriculture for tomorrow's generations</Text>
        </View>
    <Button 
        onPress={handleNavigate}
        text='Get Started'
        classNameButton='bg-primary mt-8'
        classNameText='text-white text-lg font-mBold font-extrabold'
    />
      </View>
      </Animmatable.View>
      </ImageBackground>
    </View>
  )
}
//#3f926a
export default OnboardingOneScreen