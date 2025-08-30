import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    nmrNumber: '',
    password: '',
    specialization: '',
    aboutMe: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    const requiredFields = ['name', 'phoneNumber', 'email', 'nmrNumber', 'password', 'specialization'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in: ${missingFields.join(', ')}`);
      return;
    }
    
    // Handle signup logic here
    console.log('Signup attempt:', formData);
    router.push('/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Full Name"
                placeholderTextColor="#999999"
                autoCapitalize="words"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Phone Number"
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
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
                value={formData.nmrNumber}
                onChangeText={(value) => handleInputChange('nmrNumber', value)}
                placeholder="NMR Number"
                placeholderTextColor="#999999"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Password"
                placeholderTextColor="#999999"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={formData.specialization}
                onChangeText={(value) => handleInputChange('specialization', value)}
                placeholder="Specialization"
                placeholderTextColor="#999999"
                autoCapitalize="words"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.aboutMe}
                onChangeText={(value) => handleInputChange('aboutMe', value)}
                placeholder="About Me"
                placeholderTextColor="#999999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={false}
              />
              <View style={styles.inputLine} />
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginContainer} onPress={handleLogin}>
              <ThemedText style={styles.loginText}>
                Already have an account? <ThemedText style={styles.loginLink}>Log in</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <ThemedText style={styles.termsText}>
              By signing up for Herbal Doc, you are agreeing to our{' '}
              <ThemedText style={styles.termsLink}>Terms of Service</ThemedText>
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    marginBottom: 40,
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
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  signupButton: {
    backgroundColor: '#20AB7D',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666666',
  },
  loginLink: {
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
