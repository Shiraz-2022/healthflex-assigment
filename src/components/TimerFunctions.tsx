import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from '@/styles/styles';
import colors from '@/config/locals/colors.locals';

export default function TimerFunctions({startAllTimers, pauseAllTimers}) {
  return (
    <View style={styles.bulkActions}>
      <TouchableOpacity
        onPress={startAllTimers}
        style={[styles.startAll, {backgroundColor: colors.C218D4E}]}>
        <Text style={styles.actionText}>Start All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={pauseAllTimers}
        style={[styles.pauseAll, {backgroundColor: colors.CF44F60}]}>
        <Text style={styles.actionText}>Pause All</Text>
      </TouchableOpacity>
    </View>
  );
}
