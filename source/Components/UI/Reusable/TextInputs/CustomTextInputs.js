
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoField = memo(({ 
  label, 
  value, 
  secure = false, 
  multiline = false,
  hasArrow = false
}) => {
  return (
    <View style={[styles.fieldContainer, hasArrow && styles.arrowContainer]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      
      <View style={[styles.valueContainer, multiline && styles.multilineContainer]}>
        <Text 
          style={[styles.value, multiline && styles.multilineText]} 
          numberOfLines={multiline ? 3 : 1}
        >
          {secure ? '••••••••' : value || 'N/A'}
        </Text>
        
        {hasArrow && (
          <Text style={styles.arrow}>{'<'}</Text>
        )}
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
});

const styles = StyleSheet.create({
  fieldContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  arrowContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  labelContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  multilineContainer: {
    height: 60,
  },
  multilineText: {
    lineHeight: 20,
  },
  arrow: {
    fontSize: 16,
    color: '#999',
  },
});

export default InfoField;