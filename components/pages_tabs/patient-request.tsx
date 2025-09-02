import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Static patient request data
const patientRequests = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    age: 28,
    condition: 'Chronic Migraine',
    urgency: 'Medium',
    requestTime: '2 hours ago',
    symptoms: 'Severe headache, nausea, sensitivity to light',
    status: 'Pending',
    avatar: '👩‍⚕️'
  },
  {
    id: 2,
    patientName: 'Michael Chen',
    age: 45,
    condition: 'Diabetes Management',
    urgency: 'Low',
    requestTime: '4 hours ago',
    symptoms: 'Blood sugar fluctuations, fatigue',
    status: 'Pending',
    avatar: '👨‍⚕️'
  },
  {
    id: 3,
    patientName: 'Emily Rodriguez',
    age: 32,
    condition: 'Anxiety Disorder',
    urgency: 'High',
    requestTime: '1 hour ago',
    symptoms: 'Panic attacks, insomnia, restlessness',
    status: 'Pending',
    avatar: '👩‍⚕️'
  },
  {
    id: 4,
    patientName: 'David Thompson',
    age: 58,
    condition: 'Hypertension',
    urgency: 'Medium',
    requestTime: '3 hours ago',
    symptoms: 'High blood pressure, chest discomfort',
    status: 'Pending',
    avatar: '👨‍⚕️'
  },
  {
    id: 5,
    patientName: 'Lisa Wang',
    age: 26,
    condition: 'Seasonal Allergies',
    urgency: 'Low',
    requestTime: '5 hours ago',
    symptoms: 'Sneezing, runny nose, itchy eyes',
    status: 'Pending',
    avatar: '👩‍⚕️'
  }
];

export default function PatientRequestPage() {
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  console.log('PatientRequestPage rendering with', patientRequests.length, 'requests');

  const handleBack = () => {
    router.back();
  };

  const handleAcceptRequest = (requestId: number) => {
    Alert.alert(
      'Accept Request',
      'Are you sure you want to accept this patient request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          style: 'default',
          onPress: () => {
            Alert.alert('Success', 'Patient request accepted successfully!');
          }
        }
      ]
    );
  };

  const handleRejectRequest = (requestId: number) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this patient request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Request Rejected', 'Patient request has been rejected.');
          }
        }
      ]
    );
  };

  const handleViewDetails = (requestId: number) => {
    setSelectedRequest(selectedRequest === requestId ? null : requestId);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8800';
      case 'low': return '#20AB7D';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FF8800';
      case 'accepted': return '#20AB7D';
      case 'rejected': return '#FF4444';
      default: return '#666666';
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>PATIENT REQUESTS</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {patientRequests.length} pending requests
          </ThemedText>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {patientRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.cardHeader}>
                <View style={styles.patientInfo}>
                  <View style={styles.avatar}>
                    <ThemedText style={styles.avatarText}>{request.avatar}</ThemedText>
                  </View>
                  <View style={styles.patientDetails}>
                    <ThemedText style={styles.patientName}>{request.patientName}</ThemedText>
                    <ThemedText style={styles.patientAge}>{request.age} years old</ThemedText>
                  </View>
                </View>
                <View style={styles.urgencyBadge}>
                  <ThemedText style={[styles.urgencyText, { color: getUrgencyColor(request.urgency) }]}>
                    {request.urgency}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.conditionRow}>
                  <ThemedText style={styles.conditionLabel}>Condition:</ThemedText>
                  <ThemedText style={styles.conditionText}>{request.condition}</ThemedText>
                </View>
                
                <View style={styles.symptomsContainer}>
                  <ThemedText style={styles.symptomsLabel}>Symptoms:</ThemedText>
                  <ThemedText style={styles.symptomsText}>{request.symptoms}</ThemedText>
                </View>

                <View style={styles.metaInfo}>
                  <View style={styles.metaItem}>
                    <ThemedText style={styles.metaLabel}>Requested:</ThemedText>
                    <ThemedText style={styles.metaValue}>{request.requestTime}</ThemedText>
                  </View>
                  <View style={styles.metaItem}>
                    <ThemedText style={styles.metaLabel}>Status:</ThemedText>
                    <ThemedText style={[styles.metaValue, { color: getStatusColor(request.status) }]}>
                      {request.status}
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => handleViewDetails(request.id)}
                >
                  <ThemedText style={styles.actionButtonText}>View Details</ThemedText>
                </TouchableOpacity>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]} 
                    onPress={() => handleRejectRequest(request.id)}
                  >
                    <ThemedText style={styles.rejectButtonText}>Reject</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.acceptButton]} 
                    onPress={() => handleAcceptRequest(request.id)}
                  >
                    <ThemedText style={styles.acceptButtonText}>Accept</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Expanded Details */}
              {selectedRequest === request.id && (
                <View style={styles.expandedDetails}>
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Detailed Symptoms</ThemedText>
                    <ThemedText style={styles.detailText}>
                      Patient reports {request.symptoms.toLowerCase()}. 
                      Symptoms have been present for the last few days and are affecting daily activities.
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Medical History</ThemedText>
                    <ThemedText style={styles.detailText}>
                      No significant medical history. Patient is generally healthy with no known allergies.
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Preferred Consultation</ThemedText>
                    <ThemedText style={styles.detailText}>
                      Patient prefers video consultation. Available for appointments between 9 AM - 6 PM.
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#F8F8F8',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#20AB7D',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  requestCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  patientAge: {
    fontSize: 14,
    color: '#666666',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  conditionRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  conditionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    width: 80,
  },
  conditionText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  symptomsContainer: {
    marginBottom: 16,
  },
  symptomsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  symptomsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#888888',
    marginRight: 4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
  },
  cardActions: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#20AB7D',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#FF4444',
  },
  rejectButtonText: {
    color: '#FF4444',
  },
  acceptButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#20AB7D',
    borderColor: '#20AB7D',
  },
  acceptButtonText: {
    color: '#FFFFFF',
  },
  expandedDetails: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
}); 