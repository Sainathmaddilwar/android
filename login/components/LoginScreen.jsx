import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const handleLogin = async () => {
 
    try {
      const response = await fetch('https://api-dev-pad-tech.kristalball.com/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // Make sure to replace the placeholders with actual values
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });
  
   
      const responseData = await response.json();
      console.log('API Response:', responseData);
      if (responseData.error) {
        
        console.error('Login failed:', responseData.statusMessage);
      } else {
        console.log('Login successful');
        const token = responseData.data.token;
       
        // for meantime it will expires after 20 seconds
        const expirationTimestamp = Date.now() + 10000   //10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds 
    
      console.log(token);
        // Store token and expiration timestamp securely using react-native-keychain
        try {
          // await Keychain.setGenericPassword('token', token, {
          //   service: 'authToken',
          // });
          // await Keychain.setGenericPassword('expiration', expirationTimestamp.toString(), {
          //   service: 'authTokenExpiration',
          // });
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('expiration', expirationTimestamp.toString());
          // Navigate to the home screen or perform any other action
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error storing data:', error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>KristalBall</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <View style={{gap:10}}>
      <Button title="Login" onPress={handleLogin} />
      <Button title="ForgotPassword" onPress={()=>navigation.navigate('ForgotPage')} />
      </View>
      
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

export default LoginScreen;
