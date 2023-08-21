import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleResetPassword = async () => {
    if (!password || !passwordConfirmation) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    try {
      const response = await resetPassword(
        route.params.email,
        route.params.otp,
        password,
        passwordConfirmation
      );

      if (response.error) {
        Alert.alert('Error', 'An error occurred while resetting the password.');
      } else {
        Alert.alert('Success', 'Password has been reset successfully.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const resetPassword = async (email, otp, password, passwordConfirmation) => {
    const url = 'https://api-dev-pad-tech.kristalball.com/api/v1/reset-password-by-otp'; 

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    return await response.json();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={text => setPasswordConfirmation(text)}
        value={passwordConfirmation}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default ResetPasswordScreen;
