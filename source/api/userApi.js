
import { useState, useEffect } from 'react';

export const fetchUsers = async (size = 80) => {
  try {
    const response = await fetch(
      `https://random-data-api.com/api/users/random_user?size=${size}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


export const useUserData = (size = 80) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers(size);
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [size]);

  return { users, loading, error };
};