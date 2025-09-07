import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { authAPI, storage } from '@/utils/api';

export default function HomePage() {
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyJWTAndGetDoctorInfo();
  }, []);

  const verifyJWTAndGetDoctorInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('../login');
        return;
      }

      // Get user data from storage instead of making API call
      const userData = await storage.getUserData();
      if (userData) {
        setDoctorInfo(userData);
        console.log('Doctor info loaded from storage:', userData);
      } else {
        // If no stored data, try API call as fallback
        const response = await authAPI.verifyJWT(token);
        if (response.status === 200) {
          const { message, doctor } = response.data;
          if (message === "JWT verified" && doctor) {
            setDoctorInfo(doctor);
            await storage.setUserData(doctor);
            console.log('Doctor info fetched from API:', doctor);
          }
        }
      }
    } catch (error: any) {
      console.error('Error loading doctor info:', error);
      
      if (error.response?.status === 401) {
        // Token is invalid or expired
        await storage.clearAll();
        router.push('../login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientRequest = () => {
    router.push('../patient-request');
  };

  const handleHistory = () => {
    router.push('../history');
  };

  const handlePaymentHistory = () => {
    router.push('../payment-history');
  };

  const handleProfileClick = () => {
    router.push('/(tabs)/my-profile');
  };


  const showDoctorInfo = () => {
    if (doctorInfo) {
      Alert.alert(
        'Doctor Information',
        `Name: ${doctorInfo.name}\nEmail: ${doctorInfo.email}\nPhone: ${doctorInfo.phonenumber}\nNMR: ${doctorInfo.nmr_number}\nHospital: ${doctorInfo.hospital}\nSpecialization: ${doctorInfo.specialization}\nAbout: ${doctorInfo.aboutme}\nBooked: ${doctorInfo.booked}\nBooked By: ${doctorInfo.bookedby}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Doctor Info', 'No doctor information available');
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <ThemedText style={styles.greeting}>
              HELLO, DR. {doctorInfo?.name?.split(' ')[0] }
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfileClick}>
            <View style={styles.profileIcon}>
              <ThemedText style={styles.profileText}>
                {doctorInfo?.name?.charAt(0)?.toUpperCase() || 'P'}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>


        {/* Main Content */}
        <View style={styles.content}>
          {/* Patient Request Card */}
          <TouchableOpacity style={styles.fullWidthCard} onPress={handlePatientRequest}>
            <View style={styles.cardLeftBorder} />
            <View style={styles.cardContent}>
              <View style={styles.cardIcon}>
                <ThemedText style={styles.iconText}>👥</ThemedText>
              </View>
              <View style={styles.cardTextContainer}>
                <ThemedText style={styles.cardTitle}>PATIENT REQUEST</ThemedText>
                <ThemedText style={styles.cardDescription}>
                  REVIEW AND MANAGE PATIENT REQUESTS
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          {/* History and Payment History Row */}
          <View style={styles.halfWidthRow}>
            {/* History Card */}
            <TouchableOpacity style={styles.halfWidthCard} onPress={handleHistory}>
              <View style={styles.smallCardIcon}>
                <ThemedText style={styles.smallIconText}>📋</ThemedText>
              </View>
              <ThemedText style={styles.smallCardTitle}>HISTORY</ThemedText>
            </TouchableOpacity>

            {/* Payment History Card */}
            <TouchableOpacity style={styles.halfWidthCard} onPress={handlePaymentHistory}>
              <View style={styles.smallCardIcon}>
                <ThemedText style={styles.smallIconText}>💰</ThemedText>
              </View>
              <ThemedText style={styles.smallCardTitle}>PAYMENT HISTORY</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <ThemedText style={styles.navIcon}>🏠</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <ThemedText style={styles.navIcon}>🔄</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <ThemedText style={styles.navIcon}>🔖</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Overlay to close dropdown when clicking outside */}
      {/* {showProfileDropdown && (
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )} */}
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
    paddingBottom: 32,
  },
  greetingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  doctorInfo: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  doctorInfoContainer: {
    marginTop: 4,
  },
  aboutMe: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    fontStyle: 'italic',
    maxWidth: 200,
  },
  bookingStatus: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#20AB7D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  fullWidthCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardLeftBorder: {
    width: 4,
    backgroundColor: '#20AB7D',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  halfWidthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidthCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    width: '48%',
    paddingVertical: 24,
    alignItems: 'center',
  },
  smallCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  smallIconText: {
    fontSize: 20,
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    color: '#20AB7D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#333333',
  },
});
