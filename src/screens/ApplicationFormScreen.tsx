import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, Alert, Pressable, 
  ScrollView, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';

type ApplicationRouteProp = RouteProp<RootStackParamList, 'ApplicationForm'>;

export const ApplicationFormScreen = () => {
  const route = useRoute<ApplicationRouteProp>();
  const navigation = useNavigation<any>();
  const { job } = route.params;
  const { colors } = useApp();

  // Create a reference to the ScrollView
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
          text: "Done",
          onPress: () => {
            navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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
        ref={scrollViewRef} // Attach the reference here
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
          // 1. Scroll to bottom when the user taps into this box
          onFocus={() => {
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 250); // 250ms delay allows the Android keyboard time to animate up
          }}
          // 2. Scroll to bottom every time a new line is added
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        />

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

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Ensure enough padding at the bottom so the button can be pushed above the keyboard
  scrollContent: { padding: 20, paddingBottom: 150 }, 
  jobContext: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  logo: { width: 44, height: 44, borderRadius: 8, marginRight: 12 },
  contextTitle: { fontSize: 16, fontWeight: '700' },
  contextCompany: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 12, paddingLeft: 40, fontSize: 15 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  textArea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 140, marginBottom: 24 }, 
  submitBtn: { padding: 16, borderRadius: 8, alignItems: 'center', elevation: 2 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});