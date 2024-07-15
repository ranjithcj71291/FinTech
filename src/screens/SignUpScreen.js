import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../store/actions/authActions';
import { clearError } from '../store/reducers/authReducer';
import Loader from '../components/common/Loader';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleSignUp = async () => {
    if (name && email && password) {
      setIsLoading(true);
      await dispatch(signUp({ name, email, password }));
      setIsLoading(false);
    } else {
      alert('Please enter all fields');
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        {isLoading ? <Loader /> : <Text style={styles.buttonText}>Sign up</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => {
            dispatch(clearError());
            navigation.navigate('Login');
          }}>
          <Text style={styles.footerLinkText}>Login</Text>
        </TouchableOpacity>
        <Text>here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerLink: {
    marginHorizontal: 5,
  },
  footerLinkText: {
    color: 'blue',
  },
});

export default SignupScreen;
