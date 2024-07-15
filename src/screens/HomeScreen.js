import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions/authActions';
import Loader from '../components/common/Loader';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const isNewUser = useSelector((state) => state.auth.isNewUser);

  const handleLogout = async () => {
    setIsLoading(true);
    await dispatch(logout());
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginRight: 5 }}>You are,</Text>
        {isNewUser ? (
          <Text>New User</Text>
        ) : (
          <Text>Existing user</Text>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        {isLoading ? <Loader /> : <Text>Logout</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default HomeScreen;
