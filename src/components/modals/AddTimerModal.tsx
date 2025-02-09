import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  FlatList,
} from 'react-native';
import {categories} from '@/config/constants/contants';
import colors, {makeTransparent} from '@/config/locals/colors.locals';
import {ITimer} from '@/types/timer';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (timer: ITimer) => void;
}

const AddTimerModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setMinutes('');
    setSeconds('');
    setShowDropdown(false);
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowDropdown(false);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !category.trim()) {
      Alert.alert('Error', 'Please enter a valid name and category');
      return;
    }

    const totalSeconds =
      (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (totalSeconds <= 0) {
      Alert.alert('Error', 'Please enter a valid time duration');
      return;
    }

    const newTimer: ITimer = {
      id: Math.random().toString(),
      name,
      category,
      duration: totalSeconds,
      remainingTime: totalSeconds,
      status: 'running',
      progress: 0,
      halfAlert: false,
    };

    onSubmit(newTimer);
    onClose();
    resetForm();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} />

              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter timer name"
                placeholderTextColor={makeTransparent(colors.C282829, 50)}
              />

              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowDropdown(!showDropdown)}>
                <Text
                  style={
                    category ? styles.categoryText : styles.placeholderText
                  }>
                  {category || 'Select a category'}
                </Text>
              </TouchableOpacity>

              {/* Dropdown List */}
              {showDropdown && (
                <View style={styles.dropdown}>
                  <FlatList
                    data={categories}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => handleCategorySelect(item)}>
                        <Text style={styles.dropdownText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              <Text style={styles.label}>Set Time (minutes:seconds)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputSmall}
                  value={minutes}
                  onChangeText={setMinutes}
                  placeholder="Minutes"
                  keyboardType="numeric"
                  placeholderTextColor={makeTransparent(colors.C282829, 50)}
                />
                <Text style={styles.colon}>:</Text>
                <TextInput
                  style={styles.inputSmall}
                  value={seconds}
                  onChangeText={setSeconds}
                  placeholder="Seconds"
                  keyboardType="numeric"
                  placeholderTextColor={makeTransparent(colors.C282829, 50)}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Start Timer</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingBottom: 100,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.C000000,
  },
  input: {
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: makeTransparent(colors.C5B5E61, 15),
    color: colors.C282829,
  },
  dropdownInput: {
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: makeTransparent(colors.C5B5E61, 15),
  },
  categoryText: {
    fontSize: 16,
    color: colors.C000000,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.C282829,
  },
  dropdown: {
    backgroundColor: colors.CFFC837,
    borderRadius: 20,
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.CFFF,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSmall: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: makeTransparent(colors.C5B5E61, 15),
    textAlign: 'center',
    color: colors.C282829,
  },
  colon: {
    fontSize: 18,
    marginHorizontal: 5,
    color: colors.C000000,
  },
  submitButton: {
    backgroundColor: '#FEC83C',
    borderRadius: 8,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
  },
  closeButton: {
    marginTop: 7,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: colors.C5B5E61,
    width: 30,
    height: 5,
    borderRadius: 50,
    alignSelf: 'center',
  },
});

export default AddTimerModal;
