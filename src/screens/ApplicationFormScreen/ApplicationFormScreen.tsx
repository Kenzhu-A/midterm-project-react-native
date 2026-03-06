import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Alert, Pressable, 
  ScrollView, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './ApplicationFormScreen.styles';

type ApplicationRouteProp = RouteProp<RootStackParamList, 'ApplicationForm'>;

const MAX_REASON_LENGTH = 500;

export const ApplicationFormScreen = () => {
  const route = useRoute<ApplicationRouteProp>();
  const navigation = useNavigation<any>();
  const { job } = route.params;
  
  const { colors, applyForJob } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');

  const validateAndSubmit = () => {
    if (!name.trim()) return Alert.alert("Required", "Please provide your full name.");
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return Alert.alert("Invalid Data", "Please provide a valid email.");
    if (contact.length < 10 || isNaN(Number(contact))) return Alert.alert("Invalid Data", "Please provide a valid contact number.");
    if (!reason.trim()) return Alert.alert("Required", "Please tell us why we should hire you.");

    Alert.alert(
      "Application Sent",
      `Successfully applied for ${job.title} at ${job.company}!`,
      [
        {
          text: "Okay", // Strict Requirement Met
          onPress: () => {
            applyForJob(job); 
            
            // Clear form after submission requirement
            setName('');
            setEmail('');
            setContact('');
            setReason('');

            // Redirect requirement logic
            if (route.params.fromSavedJobs) {
              navigation.navigate('MainTabs', { screen: 'JobFinder' });
            } else {
              navigation.goBack(); 
            }
          }
        }
      ]
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Job Context Header */}
        <View style={[styles.jobContext, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image source={{ uri: job.companyLogo }} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.contextTitle, { color: colors.text }]} numberOfLines={1}>{job.title}</Text>
            <Text style={[styles.contextCompany, { color: colors.secondaryText }]}>{job.company}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Information</Text>

        <View style={styles.inputGroup}>
          <MaterialIcons name="person" size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
            placeholder="Full Name" 
            placeholderTextColor={colors.secondaryText} 
            value={name} 
            onChangeText={setName} 
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="email" size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
            placeholder="Email Address" 
            placeholderTextColor={colors.secondaryText} 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="phone" size={20} color={colors.secondaryText} style={styles.inputIcon} />
          <TextInput 
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
            placeholder="Contact Number" 
            placeholderTextColor={colors.secondaryText} 
            value={contact} 
            onChangeText={setContact} 
            keyboardType="phone-pad" 
          />
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Why should we hire you?</Text>
        <TextInput 
          style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} 
          placeholder="Briefly describe your qualifications..."
          placeholderTextColor={colors.secondaryText}
          value={reason} 
          onChangeText={setReason} 
          multiline={true} 
          textAlignVertical="top" 
          maxLength={MAX_REASON_LENGTH}
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 250); 
          }}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        />
        
        {/* Character Counter */}
        <Text style={[styles.charCount, { color: colors.secondaryText }]}>
          {reason.length}/{MAX_REASON_LENGTH}
        </Text>

        <Pressable 
          style={({pressed}) => [styles.submitBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }]} 
          onPress={validateAndSubmit}
        >
          <Text style={styles.btnText}>Submit Application</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

