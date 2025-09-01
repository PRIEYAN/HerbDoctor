import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomePage() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleMyProfile = () => {
    console.log('handleMyProfile called - navigating to my-profile');
    Alert.alert('Debug', 'handleMyProfile function called!');
    setShowProfileDropdown(false);
    router.push('/(tabs)/my-profile');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setShowProfileDropdown(false);
            router.push('../login');
          },
        },
      ]
    );
  };

  const closeDropdown = () => {
    setShowProfileDropdown(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>HELLO, DR. PRIEYAN</ThemedText>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfileClick}>
            <View style={styles.profileIcon}>
              <ThemedText style={styles.profileText}>P</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleMyProfile}>
              <ThemedText style={styles.dropdownText}>My Profile</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
              <ThemedText style={[styles.dropdownText, styles.logoutText]}>Logout</ThemedText>
            </TouchableOpacity>
          </View>
        )}

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
    position: 'relative',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
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
  dropdownContainer: {
    position: 'absolute',
    top: 120,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },
  logoutText: {
    color: '#FF4444',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
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
});
