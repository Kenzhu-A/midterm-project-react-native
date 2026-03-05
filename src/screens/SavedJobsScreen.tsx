import React, { useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { JobCard } from '../components/JobCard';
import { MaterialIcons } from '@expo/vector-icons';
import { BackHandler } from 'react-native';

export const SavedJobsScreen = () => {
  const { savedJobs, colors } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // REQUIREMENT: Prevent hardware back button from exiting app
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; 
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedJobs.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="bookmark-border" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>You haven't saved any jobs yet.</Text>
        </View>
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <JobCard 
              job={item} 
              onApply={() => navigation.navigate('ApplicationForm', { job: item })} 
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, marginTop: 16, textAlign: 'center', fontWeight: '500' }
});