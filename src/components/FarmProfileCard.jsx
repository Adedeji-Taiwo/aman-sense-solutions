import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const FarmProfileCard = ({ farmProfile, onPress }) => {
  if (!farmProfile) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="w-full rounded-2xl border border-dashed border-primary bg-[#f3fbf7] px-4 py-5"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm font-mSemiBold text-black">
              Add Farm Profile
            </Text>
            <Text className="text-xs font-mRegular text-gray-500 mt-1">
              Create your farm profile to enable smart irrigation recommendations.
            </Text>
          </View>

          <View className="h-10 w-10 rounded-full bg-primary items-center justify-center">
            <MaterialIcons name="add" size={24} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full rounded-2xl border border-primary bg-[#f3fbf7] px-4 py-4"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-base font-mSemiBold text-black">
            {farmProfile.farmName}
          </Text>

          <View className="flex-row items-center mt-2">
            <FontAwesome5 name="seedling" size={14} color="#3f926a" />
            <Text className="text-xs font-mRegular text-gray-600 ml-2">
              {farmProfile.cropType} • {farmProfile.growthStage}
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <MaterialIcons name="terrain" size={16} color="#3f926a" />
            <Text className="text-xs font-mRegular text-gray-600 ml-2">
              {farmProfile.soilType} soil • {farmProfile.plotSizeHa} ha
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <Ionicons name="water-outline" size={16} color="#3f926a" />
            <Text className="text-xs font-mRegular text-gray-600 ml-2">
              {farmProfile.irrigationMethod} irrigation
            </Text>
          </View>
        </View>

        <MaterialIcons name="edit" size={20} color="#3f926a" />
      </View>
    </TouchableOpacity>
  );
};

export default FarmProfileCard;