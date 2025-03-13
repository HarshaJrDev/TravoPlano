import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  Alert, 
  ScrollView
} from 'react-native';
import UserInfoCard from '../Components/UI/Reusable/Card/InfoCard';
import { fetchUsers } from '../api/userApi';

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TOTAL_USERS = 80;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await fetchUsers(TOTAL_USERS);
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      Alert.alert('Error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentUser = useMemo(() => users[currentIndex] || {}, [users, currentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsClick((prev) => !prev);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < users.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsClick((prev) => !prev);
    }
  }, [currentIndex, users.length]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUsers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView>
         <SafeAreaView style={styles.container}>
      <UserInfoCard user={currentUser} />
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.disabledButton,
            { backgroundColor: isClick ? '#fff' : '#000' }
          ]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navButtonText, { color: isClick ? '#000' : '#fff' }]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === users.length - 1 && styles.disabledButton,
            { backgroundColor: isClick ? '#000' : '#fff' }
          ]}
          onPress={handleNext}
          disabled={currentIndex === users.length - 1}
        >
          <Text style={[styles.navButtonText, { color: isClick ? '#fff' : '#000' }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

    </ScrollView>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#d2d22d',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default App;
