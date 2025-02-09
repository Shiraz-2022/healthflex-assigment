// TimerCard.js
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  AppState,
} from 'react-native'; // Import AppState
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import styles from '@/styles/styles';
import colors from '@/config/locals/colors.locals';
import {imagePaths} from '@/config/constants/imagePaths';

export default function TimerCard({
  timer,
  setTimers,
  expandedTimer,
  isGlobalPaused,
  onDelete,
  startIndividualTimer,
  stopIndividualTimer, // Receive the new prop
}) {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [isRunning, setIsRunning] = useState(timer.status === 'running');
  const [halfAlert, setHalfAlert] = useState(false);

  useEffect(() => {
    const loadTimerState = async () => {
      try {
        const storedTimerState = await AsyncStorage.getItem(timer.id);
        if (storedTimerState) {
          const {
            remainingTime: storedRemainingTime,
            isRunning: storedIsRunning,
          } = JSON.parse(storedTimerState);
          setRemainingTime(storedRemainingTime);
          setIsRunning(storedIsRunning);
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    };

    loadTimerState();
  }, [timer.id]);

  useEffect(() => {
    setRemainingTime(timer.remainingTime); // Initialize or update remainingTime
  }, [timer.remainingTime]);

  useEffect(() => {
    setIsRunning(timer.status === 'running'); // Sync running status
  }, [timer.status]);

  useEffect(() => {
    if (halfAlert && remainingTime === Math.floor(timer.duration / 2)) {
      Alert.alert('Halfway Alert', `You're halfway through ${timer.name}!`);
    }
  }, [remainingTime, halfAlert, timer.name, timer.duration]);

  const toggleTimer = async () => {
    if (isRunning) {
      await stopTimer();
    } else {
      startIndividualTimer(timer);
      await updateTimerInStorage(remainingTime, 'running');
      setIsRunning(true);
    }
  };

  const stopTimer = async () => {
    stopIndividualTimer(timer); // Call the function to clear the interval
    await updateTimerInStorage(remainingTime, 'paused');
    setIsRunning(false);
  };

  const restartTimer = async () => {
    setRemainingTime(timer.duration);
    await updateTimerInStorage(timer.duration, 'paused');
    setIsRunning(false);
  };

  const updateTimerInStorage = async (timeLeft, status) => {
    try {
      setTimers(prevTimers =>
        prevTimers.map(t =>
          t.id === timer.id ? {...t, remainingTime: timeLeft, status} : t,
        ),
      );
      const storedTimers = await AsyncStorage.getItem('timers');
      let timers = storedTimers ? JSON.parse(storedTimers) : [];
      const index = timers.findIndex(t => t.id === timer.id);
      if (index !== -1) {
        timers[index].remainingTime = timeLeft;
        timers[index].status = status;
        await AsyncStorage.setItem('timers', JSON.stringify(timers));
      }
    } catch (error) {
      console.error('Error updating timer:', error);
    }
  };

  useEffect(() => {
    const saveTimerState = async () => {
      try {
        const timerState = JSON.stringify({
          remainingTime: remainingTime,
          isRunning: isRunning,
        });
        await AsyncStorage.setItem(timer.id, timerState); // Unique key for each timer
      } catch (error) {
        console.error('Error saving timer state:', error);
      }
    };

    saveTimerState();
  }, [remainingTime, isRunning, timer.id]); // Add timer.id as a dependency

  return (
    <View
      style={[
        styles.timerCard,
        expandedTimer === timer.id && styles.expandedTimerCard,
      ]}>
      <View style={styles.timerHeader}>
        <Text style={styles.timerTitle}>{timer.name}</Text>
        <Text style={styles.timerStatusPaused}>
          {typeof timer.status === 'string'
            ? timer.status.toUpperCase()
            : 'PAUSED'}
        </Text>
      </View>

      {/* Progress Bar */}
      <Progress.Bar
        progress={(timer.duration - remainingTime) / timer.duration}
        width={null}
        color={colors.C002147}
        height={15}
        borderRadius={20}
        style={styles.progressBar}
        unfilledColor={colors.CFFF}
        borderWidth={0}
      />
      <Text style={styles.timeLeft}>
        Time left: {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
      </Text>

      <View style={styles.controlsContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleTimer}>
            <Image source={isRunning ? imagePaths.pause : imagePaths.play} />
          </TouchableOpacity>
          <TouchableOpacity onPress={restartTimer}>
            <Image source={imagePaths.restart} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Image source={imagePaths.delete} style={{width: 27, height: 27}} />
          </TouchableOpacity>
        </View>

        <View style={styles.halfAlertContainer}>
          <Text style={styles.halfAlertText}>Halfway alert</Text>
          <Switch
            value={halfAlert}
            onValueChange={() => setHalfAlert(!halfAlert)}
          />
        </View>
      </View>
    </View>
  );
}
