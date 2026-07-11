import { View, Text, TextInput } from 'react-native'
import React from 'react'




  


const Input = ({ title, placeholder, className, inputMode, value, onChangeText, secureTextEntry }) => {
  return (
    <View className={`items-start w-full gap-[10px] ${className}`}>
      <Text className="text-dark_400 text-base font-dmRegular">{title}</Text>
      <TextInput 
        className='px-5 py-[15px] border-[0.3px] border-[#dbdbdb] bg-[#f4f5f7] text-dark_500 font-dmRegular rounded-lg w-full'
        placeholder={placeholder}
        placeholderTextColor="#9a9999"
        selectionColor="#2793EB"
        inputMode={inputMode}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  )
}

export default Input
