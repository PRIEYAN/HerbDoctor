import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack initialRouteName="started">
      <Stack.Screen name="started" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="homepage" options={{ headerShown: false }} />
      <Stack.Screen name="patient-request" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="payment-history" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ headerShown: false }} />
    </Stack>
  );
}
