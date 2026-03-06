import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, TextInput, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import { fetchJobs } from '../../api/jobService';
import { JobCard } from '../../components/JobCard/JobCard';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './JobFinderScreen.styles';

export const JobFinderScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { colors, savedJobs, appliedJobs } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; 
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const data = await fetchJobs();
    setJobs(data);
    setFilteredJobs(data);
    setLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text) setFilteredJobs(jobs);
    else {
      setFilteredJobs(jobs.filter(j => 
        j.title.toLowerCase().includes(text.toLowerCase()) || 
        j.company.toLowerCase().includes(text.toLowerCase())
      ));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <MaterialIcons name="search" size={20} color={colors.secondaryText} style={styles.searchIcon} />
          <TextInput 
            style={[styles.input, { color: colors.text }]}
            placeholder="Search roles or companies..."
            placeholderTextColor={colors.secondaryText}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredJobs}
          // Fix: Use the unique item ID + index to absolutely guarantee no React key collisions
          keyExtractor={(item, index) => `${item.id}-${index}`} 
          extraData={{ savedJobs, appliedJobs }} 
          renderItem={({ item }) => (
            <JobCard 
              job={item} 
              onApply={() => navigation.navigate('ApplicationForm', { job: item })} 
            />
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

