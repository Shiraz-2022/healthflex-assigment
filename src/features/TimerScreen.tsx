import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {imagePaths} from '@/config/constants/imagePaths';
import colors from '@/config/locals/colors.locals';
import AddTimerModal from '@/components/modals/AddTimerModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ITimer} from '@/types/timer';
import TimerHeader from '@/components/TimerHeader';
import TimerFunctions from '@/components/TimerFunctions';
import {ThemeContext} from '@/context/ThemeContext';
import TimerCard from '@/components/TimerCard';

export default function TimerScreen() {
  const {theme} = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const [expandedTimer, setExpandedTimer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timers, setTimers] = useState<ITimer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const intervalRefs = useRef<{[key: string]: NodeJS.Timeout}>({});

  useEffect(() => {
    const loadTimers = async () => {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        setTimers(JSON.parse(storedTimers));
      }
    };

    loadTimers();
  }, []);

  // Filters timers based on selected category
  const filteredTimers =
    selectedCategory === 'All'
      ? timers
      : timers.filter(timer => timer.category === selectedCategory);

  // Handles adding new timers
  const handleAddTimer = async (newTimer: ITimer) => {
    try {
      const updatedTimers = [...timers, newTimer];
      setTimers(updatedTimers);
      await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding timer:', error);
    }
  };

  // Deletes a timer and clears its interval
  const handleDelete = async (timerId: string) => {
    if (intervalRefs.current[timerId]) {
      clearInterval(intervalRefs.current[timerId]);
      delete intervalRefs.current[timerId];
    }

    const updatedTimers = timers.filter(timer => timer.id !== timerId);
    setTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const pauseAllTimers = async () => {
    Object.values(intervalRefs.current).forEach(clearInterval);
    intervalRefs.current = {}; // Clear all interval references

    setIsGlobalPaused(true);

    const updatedTimers = timers.map(timer =>
      timer.status === 'running' ? {...timer, status: 'paused'} : timer,
    );

    setTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  const startAllTimers = async () => {
    setIsGlobalPaused(false);

    const updatedTimers = timers.map(timer => {
      if (timer.status === 'paused' && timer.remainingTime > 0) {
        if (!intervalRefs.current[timer.id]) {
          intervalRefs.current[timer.id] = setInterval(() => {
            setTimers(prevTimers =>
              prevTimers.map(t =>
                t.id === timer.id && t.remainingTime > 0
                  ? {...t, remainingTime: t.remainingTime - 1}
                  : t,
              ),
            );
          }, 1000);
        }
        return {...timer, status: 'running'};
      }
      return timer;
    });

    setTimers(updatedTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(updatedTimers));
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#121212' : colors.CFFF},
      ]}>
      {/* Header */}
      <TimerHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {/* Bulk Actions */}
      <TimerFunctions
        startAllTimers={startAllTimers}
        pauseAllTimers={pauseAllTimers}
      />

      <Text style={styles.sectionTitle}>Timers</Text>

      {/* Timers Scroll View */}
      <ScrollView>
        {filteredTimers.length === 0 ? (
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text>No timers found.</Text>
          </View>
        ) : (
          filteredTimers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
              setTimers={setTimers}
              expandedTimer={expandedTimer}
              onDelete={() => handleDelete(timer.id)}
              isGlobalPaused={isGlobalPaused}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.floatingButton}>
        <Image source={imagePaths.plus} style={styles.floatingIcon} />
      </TouchableOpacity>

      <AddTimerModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddTimer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 30,
    color: colors.C000000,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.CFFC837,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.C000000,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  floatingIcon: {
    width: 30,
    height: 30,
    tintColor: colors.CFFF,
  },
});
