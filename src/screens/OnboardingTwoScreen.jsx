import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import * as Animmatable from 'react-native-animatable';
import { Button } from '../components';
import {useNavigation} from '@react-navigation/native'



const OnboardingTwoScreen = () => {
    const {navigate} = useNavigation();
    const [slide, setSlide] = useState(false);


  //allow animation before navigating
  const handleNavigate = () => {
    setSlide(true);

    // Delay the function execution using setTimeout
    setTimeout(() => {
      navigate('OnboardingThree');
    }, 300);
   

  }

  

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/onbarding/onboardingbg.png")}
        resizeMode="cover"
        className='bg-[#a8cdbb] flex-1 relative items-center justify-center'
      >
        <Animmatable.View
          animation={slide ? "fadeOutLeft" : ""} 
          duration={300}
          easing="ease-out"
          className='flex-1 relative items-center justify-center'>
         <Image 
          source={require("../../assets/onbarding/onboard2.png")}
          className='h-[339px] w-full absolute top-12'
          />
        <View className='justify-start items-center bg-light_100 absolute bottom-0 w-full h-[447px] rounded-t-[40px] px-5 pt-[35px]'>
          <View className="flex-row items-start justify-center gap-2">
              <View className='w-[57px] h-1 rounded-3xl bg-light_200'></View>
              <View  className='w-[57px] h-1 rounded-3xl bg-primary'></View>
              <View  className='w-[57px] h-1 rounded-3xl bg-light_200'></View>
          </View>
          <View className='items-center gap-4 my-12'>
              <Text className='text-dark_100 text-center text-[24px] capitalize tracking-wide leading-[34px] font-mBold'>Increase Yield And Reduce Costs...</Text>
              <Text className='text-dark_200 text-center text-sm leading-[22px] w-[284px] font-semibold font-mRegular'> With precision tools and customized methods, we help farmers achieve more with less</Text>
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

export default OnboardingTwoScreen