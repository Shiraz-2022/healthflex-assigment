import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {imagePaths} from '@/config/constants/imagePaths';
import colors from '@/config/locals/colors.locals';
import AddTimerModal from '@/components/modals/AddTimerModal';
import TimerHeader from '@/components/TimerHeader';
import {ThemeContext} from '@/context/ThemeContext'; // ✅ Import ThemeContext

export default function HistoryScreen() {
  const {theme} = useContext(ThemeContext); // ✅ Get theme context
  const isDarkMode = theme === 'dark';

  const [expandedTimer, setExpandedTimer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch completed timers from AsyncStorage
  useEffect(() => {
    const fetchTimers = async () => {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        const parsedTimers = JSON.parse(storedTimers);
        const filteredTimers = parsedTimers.filter(
          timer => timer.status === 'completed',
        );
        setCompletedTimers(filteredTimers);
      }
    };

    fetchTimers();
  }, []);

  // ✅ Filter timers based on selected category
  const filteredTimers =
    selectedCategory === 'All'
      ? completedTimers
      : completedTimers.filter(timer => timer.category === selectedCategory);

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#121212' : colors.CFFF}, // ✅ Apply theme-based background
      ]}>
      {/* Header */}
      <TimerHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Timers Scroll View */}
      <Text
        style={[styles.sectionTitle, {color: isDarkMode ? '#fff' : '#000'}]}>
        Completed Timers
      </Text>

      <ScrollView style={styles.timerList} showsVerticalScrollIndicator={false}>
        {filteredTimers.length === 0 ? (
          <Text
            style={[
              styles.noTimersText,
              {color: isDarkMode ? '#ccc' : colors.CF44F60},
            ]}>
            No completed timers found.
          </Text>
        ) : (
          filteredTimers.map(timer => (
            <TouchableOpacity
              key={timer.id}
              onPress={() =>
                setExpandedTimer(expandedTimer === timer.id ? null : timer.id)
              }
              style={[
                styles.timerCard,
                expandedTimer === timer.id && styles.expandedTimerCard,
                {backgroundColor: isDarkMode ? '#333' : '#FFC72C'}, // ✅ Apply theme-based card color
              ]}>
              <View style={styles.timerHeader}>
                <Text
                  style={[
                    styles.timerTitle,
                    {color: isDarkMode ? '#fff' : '#000'},
                  ]}>
                  {timer.name}
                </Text>
                <Text style={styles.timerStatusCompleted}>COMPLETED</Text>
              </View>

              {/* Timer Details */}
              <Text
                style={[
                  styles.timeLeft,
                  {color: isDarkMode ? '#ddd' : '#333'},
                ]}>
                Duration: {timer.duration} sec
              </Text>
              <Text
                style={[
                  styles.categoryLabel,
                  {color: isDarkMode ? '#aaa' : '#555'},
                ]}>
                Category: {timer.category}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Button to Add Timer */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={styles.floatingButton}>
        <Image source={imagePaths.plus} style={styles.floatingIcon} />
      </TouchableOpacity>

      {/* Add Timer Modal */}
      <AddTimerModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={() => {}}
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
  },
  timerList: {
    flexDirection: 'column',
    gap: 10,
  },
  noTimersText: {
    textAlign: 'center',
    fontSize: 16,
  },
  timerCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  expandedTimerCard: {
    minHeight: 150,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  timerStatusCompleted: {
    color: colors.C29A847,
    fontWeight: 'bold',
  },
  timeLeft: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryLabel: {
    fontSize: 14,
    marginTop: 5,
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
    elevation: 10,
  },
  floatingIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
});
