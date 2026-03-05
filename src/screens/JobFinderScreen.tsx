import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList, TextInput, ActivityIndicator, StyleSheet, Pressable, Text, BackHandler } from 'react-native';
import { fetchJobs } from '../api/jobService';
import { JobCard } from '../components/JobCard';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

const ITEMS_PER_PAGE = 8;

export const JobFinderScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { colors, toggleTheme, theme } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList>(null);

  // Prevent universal hardware back button
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
    setCurrentPage(1); // Reset to page 1 on new search
    if (!text) setFilteredJobs(jobs);
    else {
      setFilteredJobs(jobs.filter(j => 
        j.title.toLowerCase().includes(text.toLowerCase()) || 
        j.company.toLowerCase().includes(text.toLowerCase())
      ));
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const displayedJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const changePage = (page: number) => {
    setCurrentPage(page);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true }); // Scroll to top of list
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
        <Pressable onPress={toggleTheme} style={styles.themeBtn}>
          <MaterialIcons name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={26} color={colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={displayedJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobCard 
                job={item} 
                onApply={() => navigation.navigate('ApplicationForm', { job: item })} 
              />
            )}
            contentContainerStyle={{ padding: 16 }}
          />

          {/* Business Styled Pagination Bar */}
          {filteredJobs.length > 0 && (
            <View style={[styles.pagination, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <Pressable 
                style={[styles.pageBtn, currentPage === 1 && { opacity: 0.3 }]} 
                onPress={() => changePage(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                <MaterialIcons name="chevron-left" size={24} color={colors.primary} />
                <Text style={[styles.pageBtnText, { color: colors.primary }]}>Prev</Text>
              </Pressable>

              <Text style={[styles.pageNumbers, { color: colors.text }]}>
                Page {currentPage} of {totalPages}
              </Text>

              <Pressable 
                style={[styles.pageBtn, currentPage === totalPages && { opacity: 0.3 }]} 
                onPress={() => changePage(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                <Text style={[styles.pageBtnText, { color: colors.primary }]}>Next</Text>
                <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', borderBottomWidth: 1 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, height: 44, fontSize: 15 },
  themeBtn: { padding: 8, marginLeft: 12 },
  
  // Pagination Styles
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderTopWidth: 1 },
  pageBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4 },
  pageBtnText: { fontWeight: '700', fontSize: 15 },
  pageNumbers: { fontWeight: '600', fontSize: 14 }
});