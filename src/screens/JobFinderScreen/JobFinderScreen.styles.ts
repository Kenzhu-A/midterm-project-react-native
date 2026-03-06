import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', borderBottomWidth: 1 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, height: 44, fontSize: 15 }
});