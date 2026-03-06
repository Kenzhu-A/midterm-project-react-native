import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { JobCard } from '../../components/JobCard/JobCard';
import { useApp } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { styles } from './SavedJobsScreen.styles';

export const SavedJobsScreen = () => {
  const { colors, savedJobs, appliedJobs } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No saved jobs yet.</Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          // Fix: Use the unique item ID + index
          keyExtractor={(item, index) => `${item.id}-${index}`}
          extraData={{ savedJobs, appliedJobs }} 
          // Inside your FlatList renderItem:
          renderItem={({ item }) => (
            <JobCard 
              job={item} 
              isSavedScreen={true} // Triggers the "Remove Job" text
              onApply={() => navigation.navigate('ApplicationForm', { job: item, fromSavedJobs: true })} 
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

