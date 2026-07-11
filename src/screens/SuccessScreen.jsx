import { View, Text, Image } from 'react-native'
import React from 'react'
import {Button} from '../components/index'
import { useNavigation } from '@react-navigation/native'

const SuccessScreen = () => {
    const {navigate} = useNavigation();

  return (
    <View
    className='bg-white flex-1 justify-center items-center px-6'
    >
        <Image 
          source={require("../../assets/account/success.gif")}
          className='h-[150px] w-[150px]'
        />
      <Text className='text-dark_100 text-center text-[18px] capitalize tracking-wide leading-[34px] font-dmBold mt-11 mb-3'>Account creation successful</Text>
      <Button 
        onPress={() => navigate('Home')}
        text='Done'
        classNameButton='bg-primary mt-10'
        classNameText='text-white text-lg font-mBold font-extrabold'
        />
    </View>
  )
}

export default SuccessScreen