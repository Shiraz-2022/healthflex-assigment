// features/Timer/TimerStack.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TimerScreen from '@/features/TimerScreen';

export type TimerStackParamList = {
  Timer: undefined;
};

const Stack = createNativeStackNavigator<TimerStackParamList>();

const TimerStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Timer" component={TimerScreen} />
    </Stack.Navigator>
  );
};

export default TimerStack;
