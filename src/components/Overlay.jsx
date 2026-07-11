import { View } from 'react-native'
import React from 'react'

const Overlay = () => {
  return (
    <View className='absolute inset-0 h-screen w-screen px-5 flex-1 items-center justify-center bg-dark_100 opacity-20 z-20' >
    </View>
  )
}

export default Overlay