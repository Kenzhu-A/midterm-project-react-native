import React, { useState } from 'react';
import { View, Text, Pressable, Image, Modal } from 'react-native';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';
import { styles } from '../JobCard/JobCard.styles'; // Assuming you have a separate styles file for JobCard

interface JobCardProps {
  job: Job;
  onApply: () => void;
  isSavedScreen?: boolean; // New prop to handle specific "Remove Job" text
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, isSavedScreen }) => {
  const { toggleSaveJob, isSaved, hasApplied, colors } = useApp();
  
  const saved = isSaved(job);
  const applied = hasApplied(job);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'save' | 'apply' | null>(null);

  const handleActionClick = (type: 'save' | 'apply') => {
    if (type === 'apply' && applied) return; 
    setActionType(type);
    setModalVisible(true);
  };

  const confirmAction = () => {
    setModalVisible(false);
    if (actionType === 'save') toggleSaveJob(job);
    if (actionType === 'apply') onApply();
  };

  const formatSalary = (salary: string) => {
    return salary.replace(/([a-zA-Z]+)(\d)/g, '$1 $2');
  };

  // Determine button text and styling based on screen
  const getSaveButtonText = () => {
    if (isSavedScreen) return "Remove Job";
    return saved ? "Saved" : "Save Job";
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      
      <View style={styles.headerRow}>
        <Image source={{ uri: job.companyLogo }} style={styles.logo} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{job.title}</Text>
          <Text style={[styles.company, { color: colors.secondaryText }]} numberOfLines={1}>{job.company}</Text>
          <Text style={[styles.location, { color: colors.secondaryText }]}>{job.location}</Text>
        </View>
      </View>

      <Text style={[styles.salary, { color: colors.primary }]}>{formatSalary(job.salary)}</Text>

      <View style={styles.actionRow}>
        <Pressable 
          style={({ pressed }) => [
            styles.button, styles.outlineButton,
            { 
              borderColor: isSavedScreen ? colors.error : colors.primary, 
              backgroundColor: saved && !isSavedScreen ? colors.primary : 'transparent', 
              opacity: pressed ? 0.6 : 1 
            }
          ]}
          onPress={() => handleActionClick('save')}
        >
          <Text style={[styles.btnText, { color: isSavedScreen ? colors.error : (saved ? '#fff' : colors.primary) }]}>
            {getSaveButtonText()}
          </Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            { 
              backgroundColor: applied ? colors.secondaryText : colors.primary, 
              opacity: pressed && !applied ? 0.8 : 1 
            }
          ]}
          onPress={() => handleActionClick('apply')}
          disabled={applied}
        >
          <Text style={[styles.btnText, { color: '#fff' }]}>
            {applied ? "Applied" : "Apply"}
          </Text>
        </Pressable>
      </View>

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Confirm Action</Text>
            <Text style={[styles.modalText, { color: colors.secondaryText }]}>
              {actionType === 'apply' 
                ? `Are you sure you want to apply for the ${job.title} position at ${job.company}?`
                : isSavedScreen || saved 
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
