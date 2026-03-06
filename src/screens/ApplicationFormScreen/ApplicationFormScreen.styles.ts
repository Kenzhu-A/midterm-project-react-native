import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
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
  textArea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 140, marginBottom: 8 }, 
  charCount: { textAlign: 'right', fontSize: 12, marginBottom: 24, marginRight: 4, fontWeight: '500' },
  submitBtn: { padding: 16, borderRadius: 8, alignItems: 'center', elevation: 2 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});