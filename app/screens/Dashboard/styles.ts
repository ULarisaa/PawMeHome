import { StyleSheet } from 'react-native';
import { Colors } from '../../assets/colors';
import { useColorScheme } from '../../utils/ColorSchemeContext';

export const useDashboardStyles = () => {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: 10,
    },
    text: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors[scheme].text,
      },

  });
};
