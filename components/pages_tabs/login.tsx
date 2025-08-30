import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    // Handle login logic here
    console.log('Login attempt:', { email, password });
    router.push('/homepage');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleTerms = () => {
    // Navigate to terms page
    console.log('Navigate to terms');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>Back</ThemedText>
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <ThemedText style={styles.brandText}>
            <ThemedText style={styles.brandGreen}>HERBAL</ThemedText>
            <ThemedText style={styles.brandBlack}> DOC</ThemedText>
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.inputLine} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#999999"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.inputLine} />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpContainer} onPress={handleSignUp}>
            <ThemedText style={styles.signUpText}>
              Not a member? <ThemedText style={styles.signUpLink}>Sign up now</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <ThemedText style={styles.termsText}>
            By using Herbal Doc, you are agreeing to our{' '}
            <ThemedText style={styles.termsLink}>Terms of Service</ThemedText>
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#20AB7D',
    fontSize: 16,
    fontWeight: '500',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  brandGreen: {
    color: '#20AB7D',
  },
  brandBlack: {
    color: '#000000',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#20AB7D',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signUpText: {
    fontSize: 16,
    color: '#666666',
  },
  signUpLink: {
    color: '#20AB7D',
    fontWeight: '600',
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#20AB7D',
    fontWeight: '500',
  },
});
