import { View, Image, Text } from 'react-native'
import React from 'react'
import {useNavigation} from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animmatable from 'react-native-animatable';
import { Button } from '../components';


const SplashScreen = () => {
    const {navigate} = useNavigation();

    
      //handle account validation
    const handleAccount = () => {
        navigate('OnboardingOne');
    };
      
  
    return (
        <View className='flex-1'>
        <LinearGradient
            colors={['#f5f5f5', 'rgba(42, 174, 116, 0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', position: "relative" }}
            >
         <Animmatable.Image 
          source={require("../../assets/language/logo5.png")}
          animation="fadeInUpBig"
          duration={3000}
          easing="ease-out"
          className='w-[300px] h-[250px] mx-auto -mt-56'
        />
        <View className=''>
        <Text className={`text-base font-mSemiBold`}>The journey of saving lives...</Text>
        </View>
        <Button 
          onPress={handleAccount}
          text='Discover'
          classNameButton='bg-lemon mt-24 w-[85%] py-[16px]'
          classNameText='text-white text-lg font-mBold font-extrabold'
    />
        <Image 
            source={require('../../assets/splashscreen/splashscreen.png')}
            className='absolute -bottom-24'
        />
      </LinearGradient>
        
    </View>
  )
}

export default SplashScreen