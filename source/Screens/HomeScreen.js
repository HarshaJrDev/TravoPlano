import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  SectionList,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { useTheme } from '../../source/contexts/ThemeContext';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';

//DateTimePicker
import DateTimePicker from 'react-native-date-picker';
import { Swipeable } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import DatePicker from 'react-native-date-picker';

const HomeScreen = () => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [timers, setTimers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [timerName, setTimerName] = useState('');
  const [timerDuration, setTimerDuration] = useState(new Date());
  const [timerCategory, setTimerCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeTimerId, setActiveTimerId] = useState(null);
  const animationProgress = useRef(new Animated.Value(0)).current;
  const swipeableRefs = useRef(new Map());

  // Load timers on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem('timers');
        if (storedTimers) setTimers(JSON.parse(storedTimers));
      } catch (error) {
        Alert.alert('Error', 'Failed to load timers');
      }
    };
    loadData();
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (activeTimerId) {
      interval = setInterval(() => {
        setTimers(prev => prev.map(timer => {
          if (timer.id === activeTimerId) {
            if (timer.remaining > 0) {
              return { ...timer, remaining: timer.remaining - 1 };
            } else {
              clearInterval(interval);
              Alert.alert('Timer Completed', `${timer.name} has finished!`);
              return { ...timer, status: 'completed' };
            }
          }
          return timer;
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimerId]);

  const saveTimers = async (newTimers) => {
    try {
      await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
      setTimers(newTimers);
    } catch (error) {
      Alert.alert('Error', 'Failed to save timers');
    }
  };

  const handleAddTimer = () => {
    const durationInSeconds = Math.floor(
      (timerDuration.getHours() * 3600) + 
      (timerDuration.getMinutes() * 60) + 
      timerDuration.getSeconds()
    );

    const newTimer = {
      id: Date.now().toString(),
      name: timerName,
      duration: durationInSeconds,
      remaining: durationInSeconds,
      category: timerCategory || 'Uncategorized',
      status: 'paused',
      createdAt: new Date().toISOString(),
    };

    saveTimers([...timers, newTimer]);
    setModalVisible(false);
    resetForm();
  };

  const handleDeleteTimer = (id) => {
    Alert.alert('Delete Timer', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: () => saveTimers(timers.filter(t => t.id !== id))
      }
    ]);
  };

  const handleTimerControl = (id) => {
    setActiveTimerId(prev => prev === id ? null : id);
    setTimers(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'running' ? 'paused' : 'running' } : t
    ));
  };

  const exportTimers = async () => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/timers_${Date.now()}.json`;
      await RNFS.writeFile(path, JSON.stringify(timers), 'utf8');
      Alert.alert('Export Successful', `File saved to: ${path}`);
    } catch (error) {
      Alert.alert('Export Failed', error.message);
    }
  };

  const resetForm = () => {
    setTimerName('');
    setTimerDuration(new Date());
    setTimerCategory('');
  };

  const renderTimerItem = ({ item }) => (
    <Swipeable
      ref={(ref) => swipeableRefs.current.set(item.id, ref)}
      rightThreshold={40}
      renderRightActions={() => (
        <TouchableOpacity 
          style={styles(theme).deleteAction}
          onPress={() => handleDeleteTimer(item.id)}
        >
          <Icon name="delete" size={24} color="white" />
        </TouchableOpacity>
      )}
    >
      <View style={styles(theme).timerCard}>
        <Progress.Circle
          size={70}
          progress={item.remaining / item.duration}
          color={theme.primary}
          thickness={6}
          showsText
          textStyle={styles(theme).progressText}
          formatText={() => 
            `${Math.floor(item.remaining / 60)}:${(item.remaining % 60).toString().padStart(2, '0')}`
          }
        />
        <View style={styles(theme).timerInfo}>
          <Text style={styles(theme).timerName}>{item.name}</Text>
          <View style={styles(theme).categoryContainer}>
            <Text style={styles(theme).categoryText}>{item.category}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles(theme).controlButton}
          onPress={() => handleTimerControl(item.id)}
        >
          <Icon 
            name={item.status === 'running' ? 'pause' : 'play-arrow'} 
            size={28} 
            color={theme.primary} 
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles(theme).container}>
      {/* Header */}
      <View style={styles(theme).header}>
        <Text style={styles(theme).headerTitle}>Timers</Text>
        <View style={styles(theme).headerActions}>
          <TouchableOpacity
            style={styles(theme).iconButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" size={28} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(theme).iconButton}
            onPress={exportTimers}
          >
            <Icon name="save-alt" size={24} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles(theme).iconButton}
            onPress={toggleTheme}
          >
            <Icon
              name={isDarkMode ? 'wb-sunny' : 'nights-stay'}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles(theme).chipsContainer}
      >
        {['All', ...new Set(timers.map(t => t.category))].map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles(theme).categoryChip,
              filterCategory === category && styles(theme).selectedCategoryChip
            ]}
            onPress={() => setFilterCategory(category === 'All' ? '' : category)}
          >
            <Text style={[
              styles(theme).categoryChipText,
              filterCategory === category && styles(theme).selectedCategoryChipText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Timer List */}
      {timers.length === 0 ? (
        <View style={styles(theme).emptyState}>
          <LottieView
            source={require('../../assets/json/Empty.json')}
            autoPlay
            loop
            style={styles(theme).emptyAnimation}
          />
          <Text style={styles(theme).emptyText}>No timers found</Text>
        </View>
      ) : (
        <SectionList
          sections={[
            { title: 'Active Timers', data: timers.filter(t => t.status === 'running') },
            { title: 'Paused Timers', data: timers.filter(t => t.status === 'paused') },
            { title: 'Completed Timers', data: timers.filter(t => t.status === 'completed') },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={renderTimerItem}
          renderSectionHeader={({ section }) => (
            <Text style={styles(theme).sectionHeader}>{section.title}</Text>
          )}
        />
      )}

      {/* Add Timer Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(theme).modalContainer}>
          <View style={styles(theme).modalContent}>
            <Text style={styles(theme).modalTitle}>Create New Timer</Text>

            <TextInput
              placeholder="Timer Name"
              placeholderTextColor={theme.placeholder}
              style={styles(theme).input}
              value={timerName}
              onChangeText={setTimerName}
            />

            <TouchableOpacity
              style={styles(theme).timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon name="access-time" size={24} color={theme.primary} />
              <Text style={styles(theme).timePickerText}>
                {timerDuration.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>

            {/* {showTimePicker && (
              <DateTimePicker
                value={timerDuration}
                mode="time"
                display="spinner"
                onChange={(_, date) => {
                  setShowTimePicker(false);
                  date && setTimerDuration(date);
                }}
                themeVariant={isDarkMode ? 'dark' : 'light'}
              />
            )} */}
{showTimePicker && (
  <DatePicker
    modal
    open={showTimePicker}
    date={timerDuration}
    mode="time"
    onConfirm={(selectedDate) => {
      setShowTimePicker(false);
      setTimerDuration(selectedDate);
    }}
    onCancel={() => {
      setShowTimePicker(false);
    }}
  />
)}



            <TextInput
              placeholder="Category"
              placeholderTextColor={theme.placeholder}
              style={styles(theme).input}
              value={timerCategory}
              onChangeText={setTimerCategory}
            />

            <View style={styles(theme).modalButtons}>
              <TouchableOpacity
                style={[styles(theme).button, styles(theme).cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles(theme).buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles(theme).button, styles(theme).saveButton]}
                onPress={handleAddTimer}
              >
                <Text style={styles(theme).buttonText}>Save Timer</Text>
                <Icon name="check" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#00",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: theme.iconBackground,
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: theme.cardBackground,
    elevation: 2,
  },
  timerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  timerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  categoryContainer: {
    backgroundColor: theme.chipBackground,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    color: theme.chipText,
  },
  controlButton: {
    padding: 8,
  },
  deleteAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginVertical: 8,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: theme.chipBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectedCategoryChip: {
    backgroundColor: theme.primary,
  },
  categoryChipText: {
    color: theme.chipText,
  },
  selectedCategoryChipText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: theme.modalBackground,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: theme.text,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timePickerText: {
    color: theme.text,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: theme.buttonCancelBackground,
  },
  saveButton: {
    backgroundColor: theme.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textSecondary,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textSecondary,
    marginLeft: 16,
    marginTop: 16,
  },
  progressText: {
    color: theme.text,
    fontWeight: '500',
  },
});

export default HomeScreen;