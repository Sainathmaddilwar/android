import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const expirationTimestamp = await AsyncStorage.getItem('expiration');
        setToken(storedToken);
        console.log(storedToken);
        if (storedToken && expirationTimestamp) {
          const currentTime = Date.now();
          if (currentTime < parseInt(expirationTimestamp)) {
            setToken(storedToken);
          } else {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('expiration');
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking token:', error);
        setIsLoading(false);
      }
    };

    checkTokenValidity();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token?'Home':"Login"}>
        {/* {token ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )} */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
