import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, Switch, Alert} from 'react-native';
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
}) {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [isRunning, setIsRunning] = useState(timer.status === 'running');
  const [wasRunningBeforePause, setWasRunningBeforePause] = useState(false);
  const [halfAlert, setHalfAlert] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isGlobalPaused) {
      if (isRunning) {
        setWasRunningBeforePause(true);
        stopTimer();
        setIsRunning(false);
      }
    } else {
      if (wasRunningBeforePause) {
        startTimer();
        setIsRunning(true);
      }
    }
  }, [isGlobalPaused]);

  useEffect(() => {
    if (halfAlert && remainingTime === Math.floor(timer.duration / 2)) {
      Alert.alert('Halfway Alert', `You're halfway through ${timer.name}!`);
    }
  }, [remainingTime]);

  const toggleTimer = async () => {
    if (!isRunning) {
      startTimer();
      setIsRunning(true);
      setWasRunningBeforePause(false); // Reset manual tracking
      await updateTimerInStorage(remainingTime, 'running');
    } else {
      stopTimer();
      setIsRunning(false);
      await updateTimerInStorage(remainingTime, 'paused');
    }
  };

  const startTimer = () => {
    if (intervalRef.current) return; // Prevent duplicate intervals

    intervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev > 0) {
          updateTimerInStorage(prev - 1, 'running');
          return prev - 1;
        } else {
          stopTimer();
          markTimerCompleted();
          return 0;
        }
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const restartTimer = async () => {
    stopTimer();
    setRemainingTime(timer.duration);
    setIsRunning(false);
    await updateTimerInStorage(timer.duration, 'paused');
  };

  const deleteTimer = async () => {
    stopTimer();
    setTimers(prevTimers => prevTimers.filter(t => t.id !== timer.id));
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      const timers = storedTimers ? JSON.parse(storedTimers) : [];
      const updatedTimers = timers.filter(t => t.id !== timer.id);
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
    } catch (error) {
      console.error('Error deleting timer:', error);
    }
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

  const markTimerCompleted = async () => {
    try {
      setIsRunning(false);
      const storedTimers = await AsyncStorage.getItem('timers');
      let timers = storedTimers ? JSON.parse(storedTimers) : [];
      const index = timers.findIndex(t => t.id === timer.id);
      if (index !== -1) {
        timers[index].status = 'completed';
        await AsyncStorage.setItem('timers', JSON.stringify(timers));
      }
      Alert.alert('Timer Completed', `${timer.name} has finished!`);
    } catch (error) {
      console.error('Error marking timer as completed:', error);
    }
  };

  return (
    <View
      style={[
        styles.timerCard,
        expandedTimer === timer.id && styles.expandedTimerCard,
      ]}>
      <View style={styles.timerHeader}>
        <Text style={styles.timerTitle}>{timer.name}</Text>
        <Text style={styles.timerStatusPaused}>
          {timer.status.toUpperCase()}
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
          <TouchableOpacity onPress={deleteTimer}>
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
