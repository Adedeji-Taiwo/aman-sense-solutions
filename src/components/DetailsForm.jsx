import React, {useState} from 'react';
import { View, Text, TextInput } from 'react-native';
import * as Animmatable from 'react-native-animatable';
import {Button, Overlay} from './index';
import {Picker} from '@react-native-picker/picker';
import { useToast } from 'react-native-toast-notifications';


const DetailsForm = ({ setShowPopup }) => {
    const toast = useToast();
    const [plotName, setPlotName] = useState('');
    const [cropType, setCropType] = useState('');
    const [stageOfGrowth, setStageOfGrowth] = useState('');
    const [soilType, setSoilType] = useState('');
    const [plotSize, setPlotSize] = useState('');
  
    const handleSubmit = () => {
        if (!plotName || !cropType || !stageOfGrowth || !soilType || !plotSize) {
            toast.show('Please fill out all fields', {
                type: 'warning',
              });
          }
      // Handle form submission here
      console.log('Form submitted:', { plotName, cropType, stageOfGrowth, soilType, plotSize });
      setShowPopup(false)
    };

  return (
   <>
      <Overlay />
     <Animmatable.View
        animation="fadeIn"
        duration={1000}
        easing="ease-out"
        className='absolute top-[20%] mx-5 w-[90%] z-50 bg-light_100 rounded-[18px] divide-y-[0.2px] divide-[#455a64] pt-5 shadow-lg'>
        <Text  className='text-center text-dark_100 text-base font-semibold mSemiBold py-5'>Enter Your Farm Details</Text>
        <View className='divide-x-[0.2px] divide-[#455a64] w-[90%] mx-auto'>
        <TextInput
        className={`border-2 border-primary px-3 py-4 my-3 rounded-lg w-full text-base font-mRegular placeholder:text-gray-900 placeholder:text-sm`}
        placeholder="Plot Name"
        value={plotName}
        onChangeText={setPlotName}
      />
      <Picker
        selectedValue={plotSize}
        className={`border-2 border-primary px-3 py-4 my-3 rounded-lg w-full text-base font-mRegular`}
        onValueChange={(itemValue) => setPlotSize(itemValue)}
      >
        <Picker.Item label="Plot Size" value="" />
        <Picker.Item label="0-50 hectares" value="0-50" />
        <Picker.Item label="50-100 hectares" value="50-100" />
        <Picker.Item label="100-200 hectares" value="100-200" />
        <Picker.Item label="200-500 hectares" value="200-500" />
        <Picker.Item label="> 500 hectares" value="More than 500" />
      </Picker>
      <Picker
        selectedValue={cropType}
        className={`border-2 border-primary px-3 py-4 my-3 rounded-lg w-full text-base font-mRegular`}
        onValueChange={(itemValue) => setCropType(itemValue)}
      >
          <Picker.Item label="Crop Type" value="" />
        <Picker.Item label="Citrus" value="citrus" />
        <Picker.Item label="Tomato" value="tomato" />
      </Picker>
      <Picker
        selectedValue={stageOfGrowth}
        className={`border-2 border-primary px-3 py-4 my-3 rounded-lg w-full text-base font-mRegular`}
        onValueChange={(itemValue) => setStageOfGrowth(itemValue)}
      >
          <Picker.Item label="Stage of Growth" value="" />
        {[...Array(11).keys()].map((month) => (
          <Picker.Item key={month} label={`${month} months`} value={`${month} months`} />
        ))}
      </Picker>
      <Picker
        selectedValue={soilType}
        className={`border-2 border-primary px-3 py-4 my-3 rounded-lg w-full text-base font-mRegular`}
        onValueChange={(itemValue) => setSoilType(itemValue)}
      >
          <Picker.Item label="Soil Type" value="" />
        <Picker.Item label="Loam" value="loam" />
        <Picker.Item label="Sand" value="sand" />
        <Picker.Item label="Clay" value="clay" />
      </Picker>
      <Button 
         onPress={handleSubmit}
        text='Submit Details'
        classNameButton='bg-primary my-8'
        classNameText='text-white text-lg font-mBold font-extrabold'
    />

    </View>
  </Animmatable.View>
   </>
   
  );
};

export default DetailsForm;
