// src/components/Timer/TimerItem.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTimers } from '../../contexts/TimerContext';
import ProgressBar from './ProgressBar';

const TimerItem = ({ timer, onComplete }) => {
  const { startTimer, pauseTimer, resetTimer, processTimerTick } = useTimers();
  const intervalRef = useRef(null);
  const halfwayAlertShown = useRef(false);

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return 1 - (timer.remainingTime / timer.duration);
  };

  // Start timer interval
  useEffect(() => {
    if (timer.status === 'running') {
      intervalRef.current = setInterval(() => {
        const isCompleted = processTimerTick(timer.id);
        if (isCompleted) {
          clearInterval(intervalRef.current);
          onComplete(timer);
        }
        
        // Check for halfway alert
        if (timer.halfwayAlert && !halfwayAlertShown.current) {
          const progress = calculateProgress();
          if (progress >= 0.5) {
            halfwayAlertShown.current = true;
            // Trigger halfway alert
            onComplete(timer, true);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.status, timer.id]);

  // Reset halfway alert flag when timer is reset
  useEffect(() => {
    if (timer.status === 'paused' && timer.remainingTime === timer.duration) {
      halfwayAlertShown.current = false;
    }
  }, [timer.remainingTime, timer.duration, timer.status]);

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>
        <Text style={[
          styles.status, 
          timer.status === 'running' ? styles.running : 
          timer.status === 'completed' ? styles.completed : 
          styles.