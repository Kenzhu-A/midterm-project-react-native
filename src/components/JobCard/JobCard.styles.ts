import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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