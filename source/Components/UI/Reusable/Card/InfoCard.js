
import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import InfoField from '../TextInputs/CustomTextInputs';

const UserInfoCard = memo(({ user }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} 
          style={styles.avatar} 

        />
      </View>
      
      <Text style={styles.cardTitle}>Name</Text>
      
      <View style={styles.fieldsContainer}>
        <InfoField label="ID" value={user.id} />
        <InfoField label="UID" value={user.uid} />
        <InfoField label="Password" value={user.password} secure />
        <InfoField label="First Name" value={user.first_name} />
        <InfoField label="Last Name" value={user.last_name} />
        <InfoField label="Username" value={user.username} />
        <InfoField label="Email" value={user.email} />
        <InfoField label="Description" value={`${user.first_name} ${user.last_name} is a user with ID: ${user.id}`} multiline />
      </View>
      
      <View style={styles.bottomNavigation}>
        <InfoField label="Name" value={`${user.first_name} ${user.last_name}`} hasArrow />
        <InfoField label="Email" value={user.email} hasArrow />
        <InfoField label="Mobile Phone" value={user.phone_number} hasArrow />
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.user.id === nextProps.user.id;
});

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  fieldsContainer: {
    marginBottom: 15,
  },
  bottomNavigation: {
    marginTop: 'auto',
  },
});

export default UserInfoCard;