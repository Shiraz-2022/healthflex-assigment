import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TimerStack from './timer/TimerStack';
import HistoryStack from './history/HistoryStack';
import {Image, StyleSheet, View} from 'react-native';
import {imagePaths} from '@/config/constants/imagePaths';
import colors from '@/config/locals/colors.locals';

export type AppTabParamList = {
  TimerStack: undefined;
  HistoryStack: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const getTabBarIcon = (focused: boolean, routeName: string) => {
  let iconSource;

  if (routeName === 'TimerStack') {
    iconSource = focused ? imagePaths.homeYellow : imagePaths.homeWhite;
  } else if (routeName === 'HistoryStack') {
    iconSource = focused ? imagePaths.historyYellow : imagePaths.historyWhite;
  }

  return <TabBarIcon iconSource={iconSource} focused={focused} />;
};

const TabBarIcon = ({
  iconSource,
  focused,
}: {
  iconSource: any;
  focused: boolean;
}) => {
  return (
    <View style={[styles.iconContainer, focused && styles.focusedContainer]}>
      <Image source={iconSource} style={styles.tabBarIcon} />
    </View>
  );
};

const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => getTabBarIcon(focused, route.name),
        tabBarLabel: '',
        tabBarStyle: styles.tabBar,
      })}>
      <Tab.Screen name="TimerStack" component={TimerStack} />
      <Tab.Screen name="HistoryStack" component={HistoryStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 70,
    backgroundColor: colors.CFFC837,
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 50,
    shadowColor: 'transparent',
    elevation: 0,
    marginHorizontal: 100,
  },
  tabBarIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  iconContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    top: 5,
  },
  focusedContainer: {
    backgroundColor: '#FFF',
  },
});

export default AppStack;
