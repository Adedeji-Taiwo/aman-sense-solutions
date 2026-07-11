import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import {useToast} from 'react-native-toast-notifications'

const Countdown = ({ minutes, isFocused }) => {
  const [remainingTime, setRemainingTime] = useState(minutes * 60);
  const toast = useToast();

  //show toast if time is up and user is still on the particular screen
  useEffect(() => {
    if (remainingTime <= 0 && isFocused) {
      toast.show('OTP expired!', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  }, [remainingTime, toast]);
  

  //prevent time from counting down beyond zero into the negatives
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

 

  //reshape time for format for rendering 
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${padTime(minutes)}:${padTime(seconds)}`;
  };

  const padTime = (time) => {
    return String(time).padStart(2, '0');
  };

  return (
    <View className='mt-6 self-end'>
      <Text className='text-[#eb5757] text-sm font-normal]'>{formatTime(remainingTime)} min</Text>
    </View>
  );
};

export default Countdown;
