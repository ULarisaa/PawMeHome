
import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/colors';

export const getStyles = (scheme: string) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors[scheme].background,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: Colors[scheme].text,
  },
  
});
