import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {imagePaths} from '@/config/constants/imagePaths';
import {Switch} from 'react-native-switch';
import styles from '@/styles/styles';
import colors from '@/config/locals/colors.locals';
import {ThemeContext} from '@/context/ThemeContext';
import {categories} from '@/config/constants/contants';

export default function TimerHeader({selectedCategory, setSelectedCategory}) {
  const themeContext = useContext(ThemeContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (!themeContext) {
    throw new Error('TimerHeader must be used within a ThemeProvider');
  }

  const {theme, toggleTheme} = themeContext;
  const isDarkMode = theme === 'dark';

  return (
    <View style={styles.header}>
      {/* Select Category */}
      <TouchableOpacity
        onPress={() => setDropdownVisible(!dropdownVisible)}
        style={styles.categorySelector}>
        <Image source={imagePaths.expandArrow} style={styles.icon} />
        <Text style={styles.categoryText}>{selectedCategory}</Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                setDropdownVisible(false);
              }}
              style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Theme Switch */}
      <View style={styles.themeSwitch}>
        <Image
          source={imagePaths.sunYellow}
          style={[styles.icon, {opacity: isDarkMode ? 0.5 : 1}]}
        />
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          disabled={false}
          activeText={''}
          inActiveText={''}
          backgroundActive={colors.CFFC837}
          backgroundInactive={'#ccc'}
          circleActiveColor={'#fff'}
          circleInActiveColor={'#fff'}
          circleBorderWidth={4}
          circleBorderActiveColor={colors.CFFC837}
          circleBorderInactiveColor={'#ccc'}
          circleSize={22}
        />
        <Image
          source={imagePaths.moonYellow}
          style={[styles.icon, {opacity: isDarkMode ? 1 : 0.5}]}
        />
      </View>
    </View>
  );
}
