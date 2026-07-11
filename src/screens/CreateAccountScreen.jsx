import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from '../components'
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


const initialFormData = {
  phoneNumber: '',
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
  termsChecked: true,
};

const CreateAccountScreen = () => {
    const toast = useToast();
    const {navigate} = useNavigation();
    const [securePassword, setSecurePassword] = useState(true);
    const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
    const [formData, setFormData] = useState(initialFormData);



   //validate input before procession
const handleAccount = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.phoneNumber.trim()) {
    toast.show('Phone number cannot be empty!', {
      type: 'warning',
    });
    return;
  }

  if (!formData.fullName.trim()) {
    toast.show('Full name cannot be empty!', {
      type: 'warning',
    });
    return;
  }

  if (!formData.email.trim()) {
    toast.show('Email address cannot be empty!', {
      type: 'warning',
    });
    return;
  }

  if (!emailRegex.test(formData.email.trim())) {
    toast.show('Invalid email format!', {
      type: 'warning',
    });
    return;
  }

  if (!formData.password) {
    toast.show('Password cannot be empty!', {
      type: 'warning',
    });
    return;
  }

  if (formData.password.length < 8) {
    toast.show('Password must be at least 8 characters!', {
      type: 'warning',
    });
    return;
  }

  if (!formData.confirmPassword) {
    toast.show('Confirm password cannot be empty!', {
      type: 'warning',
    });
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.show('Passwords do not match!', {
      type: 'warning',
    });
    return;
  }

  if (!formData.termsChecked) {
    toast.show('Please accept the terms and conditions!', {
      type: 'warning',
    });
    return;
  }

  try {
    await AsyncStorage.setItem('user', JSON.stringify(formData));
    setFormData(initialFormData);
    navigate('Success');
  } catch (error) {
    console.error('Error creating account', error);
    toast.show('Unable to create account. Please try again.', {
      type: 'danger',
    });
  }
};
      
  return (
    <View className="flex-1 bg-light_100 pt-[78px] relative">
        {/*background svg*/}
        <Image 
          source={require("../../assets/auth/blob-high.png")}
          className='h-[200px] w-[214px] absolute -top-12 left-12 -rotate-45'
        />
        <ScrollView contentContainerStyle={{alignItems: "center", justifyContent: "flex-start", paddingHorizontal: 20, paddingBottom: 78, backgroundColor: "#fefefe", width: "100%"}}>
            <Image 
                source={require("../../assets/language/logo2.png")}
                className='h-[65px] w-[250px]'
            />
            <View className='mt-7 mb-4 self-start'>
                    <Text className='text-dark_100 text-left text-[28px] capitalize tracking-wide leading-[34px] font-dmBold'>Create Account</Text> 
            </View>

            <Input 
                title='Phone Number'
                placeholder='Enter phone number'
                inputMode="numeric"
                className='mt-10 self-start'
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            />
            <View className='relative w-full mt-6 self-start'>
            <Input 
                title='Full Name'
                placeholder='Enter full name'
                inputMode="text"
                className='mt-10 self-start'
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
            </View>
           
            <View className='relative w-full mt-6 self-start'>
            <Input 
              title='Email Address'
              placeholder='Enter email address'
              inputMode="email"
              className='mt-10 self-start'
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            </View>
         

            <View className='relative w-full mt-6 self-start'>
            <Input 
                title='Password'
                placeholder='Enter password'
                inputMode="text"
                className=''
                secureTextEntry={securePassword}
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
             <TouchableOpacity 
                 onPress={() => setSecurePassword((prevState) => !prevState)}
                className='absolute pl-5 right-0 top-[38px] w-14 py-5 z-30 rounded-r-lg'>
                <Image 
                    source={require("../../assets/account/show.png")}
                    className='h-4 w-4'
                />
            </TouchableOpacity>
            </View>

            <View className='relative w-full mt-6 self-start'>
                <Input 
                    title='Confirm Password'
                    placeholder='Enter password'
                    inputMode="text"
                    className=''
                    secureTextEntry={secureConfirmPassword}
                    value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            />
              <TouchableOpacity 
                 onPress={() => setSecureConfirmPassword((prevState) => !prevState)}
                className='absolute pl-5 right-0 top-[38px] w-14 py-5 z-30 rounded-r-lg'>
              <Image 
                source={require("../../assets/account/show.png")}
                className='h-4 w-4'
            />
              </TouchableOpacity>
            </View>



        <View className='mt-4 self-start'>
                <TouchableOpacity
                    className='flex-row gap-[22px]'
                    onPress={() => setFormData({ ...formData, termsChecked: !formData.termsChecked })}
                >
                    <View
                    className={`w-4 h-4 rounded border-primary border justify-center items-center ${formData.termsChecked ? "bg-primary" : "bg-transparent"}`} >
                    {formData.termsChecked && 
                      <Image 
                          source={require("../../assets/account/check.png")}
                          className='h-[5px] w-[7px]'
                      />}
                    </View>
                    
                    <View className='mt-7 items-start justify-start'>
                    <Text className='text-dark_500 text-center text-xs font-dmRegular'>By creating an account, you agree to our, </Text>
                    <Text className='text-primary text-center text-xs font-dmRegular mt-1'>Terms and conditions</Text>
                    </View>
                </TouchableOpacity>
                </View>




            <Button 
                onPress={handleAccount}
                text='Continue'
                classNameButton='bg-primary mt-10'
                classNameText=' text-white'
            />

        <View className='mt-7 flex-row justify-center self-center flex-grow'>
            <Text className='text-dark_500 text-center text-xs font-dmRegular'>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigate('Login')}><Text className='text-primary text-center text-xs font-dmRegular'>Sign in</Text></TouchableOpacity>
            </View>


    </ScrollView>
    {/*backgound svg */}
    <Image 
          source={require("../../assets/auth/blob-low.png")}
          className='h-[200px] w-[214px] absolute bottom-12 -right-12 rotate-45'
        />
    </View>
  )
}

export default CreateAccountScreen