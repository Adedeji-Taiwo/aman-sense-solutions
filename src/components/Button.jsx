import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'




const Button = ({text, classNameButton, classNameText, onPress}) => {
  return (
    <TouchableOpacity className={`items-center justify-center rounded-lg w-full py-[22px] ${classNameButton}`} style={styles.shadow} onPress={onPress}>
            <Text className={`text-center text-base font-dmBold ${classNameText}`}>{text}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    shadow: {
    shadowColor: 'rgba(4, 59, 103, 0.15)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    }
})


export default Button