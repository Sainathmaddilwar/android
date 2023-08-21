import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      const response = await sendOtp(email);

      if (response.error) {
        Alert.alert('Error', response.data.errors.email);
      } else {
        Alert.alert('Success', response.data.message);
        setIsOtpSent(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    try {
      const response = await verifyOtp(email, otp);

      if (response.error) {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      } else {
        navigation.navigate('ResetPage', { email });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const sendOtp = async (email) => {
    const url = 'https://api-dev-pad-tech.kristalball.com/api/v1/forgot-password'; 

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  };

  const verifyOtp = async (email, otp) => {
    const url = 'https://api-dev-pad-tech.kristalball.com/api/v1/forgot-password-validate-otp';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    const responseData = await response.json();
if(!responseData.error){
    navigation.navigate('ResetPage', { email, otp });
}else{
console.log("otp is invalid",responseData.statusMassage);
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      {!isOtpSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={text => setEmail(text)}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title="Send OTP" onPress={handleSendOtp} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            onChangeText={text => setOtp(text)}
            value={otp}
            keyboardType="numeric"
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}
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

export default ForgotPassword;
