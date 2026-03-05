import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Modal } from 'react-native';
import { Job } from '../types';
import { useApp } from '../context/AppContext';

interface JobCardProps {
  job: Job;
  onApply: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const { toggleSaveJob, isSaved, colors } = useApp();
  const saved = isSaved(job.id);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'save' | 'apply' | null>(null);

  const handleActionClick = (type: 'save' | 'apply') => {
    setActionType(type);
    setModalVisible(true);
  };

  const confirmAction = () => {
    setModalVisible(false);
    if (actionType === 'save') toggleSaveJob(job);
    if (actionType === 'apply') onApply();
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      
      {/* Top Row: Logo & Info */}
      <View style={styles.headerRow}>
        <Image source={{ uri: job.companyLogo }} style={styles.logo} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{job.title}</Text>
          <Text style={[styles.company, { color: colors.secondaryText }]} numberOfLines={1}>{job.company}</Text>
          <Text style={[styles.location, { color: colors.secondaryText }]}>{job.location}</Text>
        </View>
      </View>

      <Text style={[styles.salary, { color: colors.primary }]}>{job.salary}</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Pressable 
          style={({ pressed }) => [
            styles.button, styles.outlineButton,
            { borderColor: colors.primary, backgroundColor: saved ? colors.primary : 'transparent', opacity: pressed ? 0.6 : 1 }
          ]}
          onPress={() => handleActionClick('save')}
        >
          <Text style={[styles.btnText, { color: saved ? '#fff' : colors.primary }]}>
            {saved ? "Saved" : "Save Job"}
          </Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => handleActionClick('apply')}
        >
          <Text style={[styles.btnText, { color: '#fff' }]}>Apply</Text>
        </Pressable>
      </View>

      {/* Confirmation Modal */}
      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Confirm Action</Text>
            <Text style={[styles.modalText, { color: colors.secondaryText }]}>
              {actionType === 'apply' 
                ? `Are you sure you want to apply for the ${job.title} position at ${job.company}?`
                : saved 
                  ? "Are you sure you want to remove this job from your saved list?" 
                  : "Are you sure you want to save this job?"}
            </Text>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.border }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={confirmAction}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 50, height: 50, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  infoContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  company: { fontSize: 14, fontWeight: '500' },
  location: { fontSize: 12, marginTop: 2 },
  salary: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  outlineButton: { borderWidth: 1, marginRight: 10 },
  btnText: { fontWeight: '700', fontSize: 14 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', padding: 24, borderRadius: 12, borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 15, marginBottom: 24, lineHeight: 22 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }
});