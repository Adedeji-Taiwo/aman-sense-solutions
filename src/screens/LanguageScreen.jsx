import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import { Entypo } from '@expo/vector-icons';


const LanguageScreen = () => {
    const {navigate} = useNavigation();
    const [languages, setLanguages] = useState({
      english: false,
      french: false,
      arabic: false
    });

   

      const toggleLanguage = (language) => {
        setLanguages({
          ...languages,
          [language]: !languages[language]
        });
        navigate('SplashScreen')
      };
      
  
    return (
      <View className="flex-1 bg-light_100 pt-[25px] relative">
      {/*background svg*/}
      <ImageBackground
        source={require("../../assets/onbarding/onboardingbg.png")}
        resizeMode="cover"
        className='px-6 h-full'
      >
     
      <Image 
              source={require("../../assets/language/logo5.png")}
              className='w-[300px] h-[250px] mx-auto mt-10'
        />
     
        <View className='mt-16 w-full'>
          <Text className='text-dark_200 text-sm leading-[22px] text-left  font-mSemiBold'>Welcome,</Text>
          <Text className='text-dark_200 text-sm leading-[22px] text-left  font-mSemiBold'>Please choose your preferred language</Text>
        </View>

          <View className={`w-full my-8`}>
        <TouchableOpacity
          className={`w-full border-2 border-primary px-3 py-4 my-3 rounded flex-row justify-between items-center ${languages.english && "bg-blue-200"}`}
          onPress={() => toggleLanguage('english')}
        >
          <Text className={`text-base font-mSemiBold`}>English</Text>
          <Entypo name="circle" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-full border-2 border-primary px-3 py-4 my-3 rounded flex-row justify-between items-center ${languages.french && "bg-blue-200"}`}
          onPress={() => toggleLanguage('french')}
        >
          <Text className={`text-base font-mSemiBold`}>French</Text>
          <Entypo name="circle" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-full border-2 border-primary px-3 py-4 my-3 rounded flex-row justify-between items-center ${languages.arabic && "bg-blue-200"}`}
          onPress={() => {toggleLanguage('arabic'), console.log("arab")}}
        >
          <Text className={`text-base font-mSemiBold`}>Arabic</Text>
          <Entypo name="circle" size={20} color="black" />
        </TouchableOpacity>
    </View>
    </ImageBackground>
    </View>
  )
}

export default LanguageScreen
