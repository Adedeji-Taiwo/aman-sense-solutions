import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Animmatable from 'react-native-animatable';
import {Overlay} from './index';

const AccountPopup = ({ onClose }) => {
  return (
   <>
      <Overlay />
     <Animmatable.View
        animation="slideInUp"
        duration={1000}
        easing="ease-out"
        className='absolute top-1/2 transform -translate-y-1/2  w-full z-50 bg-light_100 rounded-[18px] divide-y-[0.2px] divide-[#455a64] pt-5 shadow-lg'>
        <Text  className='text-center text-dark_100 text-base font-dmMedium py-5'>Already have Amansense account?</Text>
        <View className='flex-row divide-x-[0.2px] divide-[#455a64]'>
          <TouchableOpacity className='flex-1 py-5' onPress={() => onClose(true)}>
            <Text className='text-center text-base font-dmMedium text-primary'>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity  className='flex-1 py-5' onPress={() => onClose(false)}>
            <Text className='text-center text-[#455a64] text-base font-dmMedium  hover:text-primary'>No</Text>
          </TouchableOpacity>
    </View>
  </Animmatable.View>
   </>
   
  );
};

export default AccountPopup;
