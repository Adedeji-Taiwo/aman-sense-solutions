import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { Button } from '../components';
import AccountPopup from '../components/AccountPopup';
import {useNavigation} from '@react-navigation/native'


const OnboardingThreeScreen = () => {
    const [showPopup, setShowPopup] = useState(false);
    const {navigate} = useNavigation();
    
    //initiate popup
    const handleOpenAccount = () => {
        setShowPopup(true);
      };
    
      
    //navigate user based on choice
    const handleClosePopup = (hasAccount) => {
      setShowPopup(false);
      if (hasAccount) {
        navigate('Login');
      } else {
        navigate('CreateAccount');
      }
    };


  return (
    <View className="flex-1 justify-start items-center pt-[78px] px-5 bg-light_100">
        <Image 
          source={require("../../assets/onbarding/onboard3.png")}
          className='h-[300px] w-[300px]'
        />
        <Text className='text-dark_100 text-center text-[24px] capitalize tracking-wide leading-[34px] mt-[14px] font-mBold'>Your Water Solution Assistant.</Text>
       <View className='w-full mt-[60px]'>
        <Button 
            onPress={handleOpenAccount}
            text='Open my Account'
            classNameButton='bg-primary'
            classNameText='text-white text-lg font-mBold font-extrabold'
        />
        <Button 
            onPress={() => navigate('Login')}
            text='Login'
            classNameButton='bg-white border border-primary mt-6'
            classNameText='text-primary text-lg font-mBold font-extrabold'
        />
       </View>
       {showPopup && <AccountPopup onClose={handleClosePopup}  />}
    </View>
  )
}

export default OnboardingThreeScreen