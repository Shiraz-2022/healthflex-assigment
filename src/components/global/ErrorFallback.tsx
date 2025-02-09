import React from 'react';
import {Modal, Text, Button, View, StyleSheet} from 'react-native';
import {useErrorHandler} from '../../context/ErrorHandlerContext';

const ErrorFallbackComponent = () => {
  const {error, clearError} = useErrorHandler();

  if (!error) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>
            {error.message || 'Something went wrong!'}
          </Text>
          <Button title="Try Again" onPress={clearError} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ErrorFallbackComponent;
