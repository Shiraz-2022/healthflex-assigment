import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTimers = async (timers: any) => {
  try {
    await AsyncStorage.setItem('timers', JSON.stringify(timers));
  } catch (error) {
    console.error('Error saving timers to AsyncStorage', error);
  }
};
