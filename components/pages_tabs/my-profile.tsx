import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { authAPI } from '@/utils/api';

export default function MyProfile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        router.push('../login');
        return;
      }

      const response = await authAPI.verifyJWT(token);

      if (response.status === 200) {
        const { message, doctor } = response.data;
        if (message === "JWT verified" && doctor) {
          setDoctorInfo(doctor);
          
          // Fetch profile picture from server
          try {
            const pfpResponse = await fetch(`http://10.10.45.109:5001/doctor/pfp/profile/${doctor.sno}`);
            if (pfpResponse.ok) {
              const imageBlob = await pfpResponse.blob();
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                setProfileImage(base64);
              };
              reader.readAsDataURL(imageBlob);
            }
          } catch (error) {
            console.log('No profile picture found or error fetching:', error);
          }
        } else {
          Alert.alert('Error', 'Invalid response from server');
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('../login');
      } else {
        Alert.alert('Error', 'Failed to fetch profile information');
      }
    } finally {
      setIsLoading(false);
    }
  };



  const uploadProfilePicture = async (imageUri: string) => {
    try {
      setIsUploading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      console.log('Uploading profile picture...');
      console.log('Token length:', token.length);
      console.log('Image URI:', imageUri);

      // Create form data
      const formData = new FormData();
      formData.append('token', token);
      
      // Create file object from URI
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      const fileName = imageUri.split('/').pop() || 'profile.jpg';
      const mimeType = 'image/jpeg';
      
      formData.append('profile_pic', {
        uri: imageUri,
        type: mimeType,
        name: fileName,
      } as any);

      console.log('Form data prepared');

      const response = await fetch('http://10.10.45.109:5001/doctor/pfp/upload', {
        method: 'PrOST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      try {
        data = JSON.parse(responseText);
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        
        if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
          Alert.alert('Server Error', 'The server returned an HTML error page. The endpoint might not exist or there\'s a server error.');
        } else {
          Alert.alert('Response Error', 'Server returned invalid JSON response.');
        }
        return;
      }

      if (response.ok) {
        Alert.alert('Success', 'Profile picture uploaded successfully!');
        // Refresh doctor info to get updated profile picture
        await fetchDoctorInfo();
      } else {
        Alert.alert('Error', data.message || 'Failed to upload profile picture');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else if (error.message.includes('timeout')) {
        Alert.alert('Timeout Error', 'Request timed out. Please try again.');
      } else {
        Alert.alert('Error', `Failed to upload profile picture: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = async () => {
    try {
      console.log('Starting image upload process...');
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      console.log('Permission granted, launching image picker...');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.01, // Ultra low quality (1%)
        base64: false, // We'll convert manually
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        
        setProfileImage(imageUri);
        
        // Convert to base64 and upload
        try {
          console.log('Starting upload...');
          await uploadProfilePicture(imageUri);
        } catch (error: any) {
          console.error('Error in image processing:', error);
          Alert.alert('Error', `Failed to process image: ${error.message}`);
        }
      } else {
        console.log('Image selection cancelled or failed');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      Alert.alert('Error', `Failed to upload image: ${error.message}`);
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

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20AB7D" />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </ThemedView>
    );
  }

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
          <TouchableOpacity 
            style={styles.profilePhotoContainer} 
            onPress={handlePhotoPress}
            disabled={isUploading}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profilePhoto}
                defaultSource={require('@/assets/images/icon.png')}
              />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <ThemedText style={styles.profilePhotoText}>
                  {doctorInfo?.name?.charAt(0)?.toUpperCase() || 'P'}
                </ThemedText>
              </View>
            )}
            <View style={styles.uploadOverlay}>
              <ThemedText style={styles.uploadText}>
                {isUploading ? '⏳' : '📷'}
              </ThemedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]} 
            onPress={handleImageUpload}
            disabled={isUploading}
          >
            <ThemedText style={styles.uploadButtonText}>
              {isUploading ? 'Uploading...' : 'Upload New Photo'}
            </ThemedText>
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
                <ThemedText style={styles.inputText}>
                  Dr. {doctorInfo?.name || 'Loading...'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.email || 'Loading...'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.phonenumber || 'Loading...'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>NMR Number</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.nmr_number || 'Loading...'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Professional Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Hospital/Clinic</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.hospital || 'Loading...'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Specialization</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.specialization || 'Loading...'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>About Me</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.aboutme || 'No information available'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Booking Status</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.booked !== "none" ? `Booked: ${doctorInfo.booked}` : 'Available'}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Additional Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Additional Information</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Profile ID</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  {doctorInfo?.sno || 'Loading...'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Account Status</ThemedText>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputText}>
                  Active
                </ThemedText>
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
    width: 60,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#20AB7D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: '#666666',
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: '#F8F8F8',
  },
  profilePhotoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#20AB7D',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profilePhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  profilePhotoText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  uploadButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#20AB7D',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileInfo: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  inputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputText: {
    fontSize: 16,
    color: '#333333',
  },
}); 