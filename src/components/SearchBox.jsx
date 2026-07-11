import { View, TextInput } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
const SearchBox = () => {
  return (
    <View className='flex-row items-center space-x-2 pb-2 pt-1 mx-auto w-[90%]'>
    <View className='flex-row items-center flex-1 space-x-2 bg-white p-3 border border-1 border-gray-300 rounded-lg'>
      <Entypo name="magnifying-glass" color="gray" size={20} />
      <TextInput 
        placeholder='Search Location'
        keyboardType='default'
        className='w-[80%]'
      />
    </View>
</View>
  )
}

export default SearchBox