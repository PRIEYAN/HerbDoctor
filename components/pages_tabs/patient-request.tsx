import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { patientRequestAPI } from '@/utils/api';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface PatientRequest {
  _id: string;
  appointmentId: string;
  doctorName: string;
  doctorPhoneNumber: string;
  patientName: string;
  patientPhoneNumber: string;
  status: string;
  reqTime: string;
  acceptTime?: string;
}

export default function PatientRequestPage() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [patientRequests, setPatientRequests] = useState<PatientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatientRequests();
  }, []);

  const fetchPatientRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientRequestAPI.getPatientRequests();
      
      if (response.data && response.data.data) {
        setPatientRequests(response.data.data);
      } else {
        setPatientRequests([]);
      }
    } catch (err: any) {
      console.error('Error fetching patient requests:', err);
      setError(err.response?.data?.message || 'Failed to fetch patient requests');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAcceptRequest = (requestId: string) => {
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
            // Refresh the list after accepting
            fetchPatientRequests();
          }
        }
      ]
    );
  };

  const handleRejectRequest = (requestId: string) => {
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
            // Refresh the list after rejecting
            fetchPatientRequests();
          }
        }
      ]
    );
  };

  const handleViewDetails = (requestId: string) => {
    setSelectedRequest(selectedRequest === requestId ? null : requestId);
  };

  const getStatusPriority = (status: string) => {
    if (!status) return 'low';
    switch (status.toLowerCase()) {
      case 'pending': return 'high';
      case 'accepted': return 'medium';
      case 'rejected': return 'low';
      default: return 'low';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF8800';
      case 'low': return '#20AB7D';
      default: return '#666666';
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return '#666666';
    switch (status.toLowerCase()) {
      case 'pending': return '#FF8800';
      case 'accepted': return '#20AB7D';
      case 'rejected': return '#FF4444';
      default: return '#666666';
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>PATIENT REQUESTS</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Loading...</ThemedText>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20AB7D" />
          <ThemedText style={styles.loadingText}>Loading patient requests...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle}>PATIENT REQUESTS</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Error occurred</ThemedText>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPatientRequests}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

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
          {patientRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No patient requests found</ThemedText>
              <TouchableOpacity style={styles.refreshButton} onPress={fetchPatientRequests}>
                <ThemedText style={styles.refreshButtonText}>Refresh</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            patientRequests.map((request) => (
              <View key={request._id} style={styles.requestCard}>
              <View style={styles.cardHeader}>
                <View style={styles.patientInfo}>
                  <View style={styles.avatar}>
                    <ThemedText style={styles.avatarText}>👤</ThemedText>
                  </View>
                  <View style={styles.patientDetails}>
                    <ThemedText style={styles.patientName}>{request.patientName}</ThemedText>
                    <ThemedText style={styles.patientAge}>{request.patientPhoneNumber}</ThemedText>
                  </View>
                </View>
                <View style={styles.urgencyBadge}>
                  <ThemedText style={[styles.urgencyText, { color: getPriorityColor(getStatusPriority(request.status)) }]}>
                    {getStatusPriority(request.status).toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.conditionRow}>
                  <ThemedText style={styles.conditionLabel}>Appointment ID:</ThemedText>
                  <ThemedText style={styles.conditionText}>{request.appointmentId}</ThemedText>
                </View>
                
                <View style={styles.symptomsContainer}>
                  <ThemedText style={styles.symptomsLabel}>Doctor:</ThemedText>
                  <ThemedText style={styles.symptomsText}>{request.doctorName}</ThemedText>
                </View>

                <View style={styles.metaInfo}>
                  <View style={styles.metaItem}>
                    <ThemedText style={styles.metaLabel}>Requested:</ThemedText>
                    <ThemedText style={styles.metaValue}>{request.reqTime}</ThemedText>
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
                  onPress={() => handleViewDetails(request._id)}
                >
                  <ThemedText style={styles.actionButtonText}>View Details</ThemedText>
                </TouchableOpacity>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]} 
                    onPress={() => handleRejectRequest(request._id)}
                  >
                    <ThemedText style={styles.rejectButtonText}>Reject</ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.acceptButton]} 
                    onPress={() => handleAcceptRequest(request._id)}
                  >
                    <ThemedText style={styles.acceptButtonText}>Accept</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Expanded Details */}
              {selectedRequest === request._id && (
                <View style={styles.expandedDetails}>
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Appointment Details</ThemedText>
                    <ThemedText style={styles.detailText}>
                      Appointment ID: {request.appointmentId}
                    </ThemedText>
                    <ThemedText style={styles.detailText}>
                      Doctor: {request.doctorName}
                    </ThemedText>
                    <ThemedText style={styles.detailText}>
                      Doctor Phone: {request.doctorPhoneNumber}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Patient Information</ThemedText>
                    <ThemedText style={styles.detailText}>
                      Patient Name: {request.patientName}
                    </ThemedText>
                    <ThemedText style={styles.detailText}>
                      Patient Phone: {request.patientPhoneNumber}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailTitle}>Timing</ThemedText>
                    <ThemedText style={styles.detailText}>
                      Request Time: {request.reqTime}
                    </ThemedText>
                    {request.acceptTime && (
                      <ThemedText style={styles.detailText}>
                        Accept Time: {request.acceptTime}
                      </ThemedText>
                    )}
                  </View>
                </View>
              )}
            </View>
            ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#20AB7D',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#20AB7D',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 