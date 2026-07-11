import { View, Text, Image } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';

const Header = ({name}) => {
  return (
    <View className='flex-row py-3 items-center px-5'>
           <View className='h-8 w-8 bg-white flex justify-center items-center p-4 rounded-full mr-4'>
           <Image 
              source={require("../../assets/language/logo1.png")}
              className='h-5 w-5'
            />
           </View>

          <View className='flex-1 justify-between flex-row w-full'>
            <Text className='font-semibold text-xl text-white font-mSemiBold'>Hello {name}...</Text>
            <FontAwesome name="bell" size={20} color="white" />
          </View>
    </View>
  )
}

export default Header