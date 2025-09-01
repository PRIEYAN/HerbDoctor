import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MyProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  };

  const handlePhotoPress = () => {
    Alert.alert(
      'Profile Photo',
      'What would you like to do?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upload New Photo',
          onPress: handleImageUpload,
        },
        {
          text: 'Remove Photo',
          style: 'destructive',
          onPress: () => setProfileImage(null),
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>My Profile</ThemedText>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.profilePhotoContainer} onPress={handlePhotoPress}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <ThemedText style={styles.profilePhotoText}>P</ThemedText>
              </View>
            )}
            <View style={styles.uploadOverlay}>
              <ThemedText style={styles.uploadText}>📷</ThemedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
            <ThemedText style={styles.uploadButtonText}>Upload New Photo</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={styles.profileInfo}>
          {/* Personal Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>Dr. Prieyan</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>dr.prieyan@herbdoctor.com</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>+1 (555) 123-4567</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Date of Birth</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>January 15, 1985</ThemedText>
              </View>
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Professional Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>License Number</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>MD123456789</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Specialization</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>Herbal Medicine & Alternative Therapy</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Years of Experience</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>15 years</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Education</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>MD - Harvard Medical School</ThemedText>
              </View>
            </View>
          </View>

          {/* Address Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Address Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Street Address</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>123 Healing Street</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>City</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>Wellness City</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>State</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>CA</ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>ZIP Code</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>90210</ThemedText>
              </View>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#333333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#20AB7D',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#20AB7D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#20AB7D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  uploadText: {
    fontSize: 16,
  },
  uploadButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadButtonText: {
    color: '#20AB7D',
    fontSize: 14,
    fontWeight: '600',
  },
  profileInfo: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputText: {
    fontSize: 16,
    color: '#333333',
  },
}); 