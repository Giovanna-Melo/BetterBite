import { StyleSheet } from 'react-native';

export const AppColors = {
  primary: '#4CAF50',
  secondary: '#8BC34A',
  text: '#333333',
  textSecondary: '#555555',
  background: '#F8F8F8',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  inputBackground: '#FFFFFF',
  placeholder: '#999999',
  error: '#E74C3C',
  success: '#4CAF50',
  accentBlue: '#2196F3',
  darkGray: '#666666',
  lightGray: '#BBBBBB',
  extraLightGray: '#F0F0F0',
};

export const AppDimensions = {
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xLarge: 32,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 15,
  },
  iconSize: {
    small: 20,
    medium: 24,
    large: 30,
    xLarge: 40,
    title: 18,
  },
  logo: {
    small: { width: 100, height: 35 },
    medium: { width: 180, height: 60 },
    large: { width: 300, height: 100 },
    massive: { width: 350, height: 120 },
    login: { width: 400, height: 140 },
  }
};

export const HeaderStyles = StyleSheet.create({
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: AppDimensions.spacing.small,
    paddingHorizontal: AppDimensions.spacing.medium,
    backgroundColor: AppColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 60,
    paddingTop: 0,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppDimensions.spacing.small,
    paddingRight: AppDimensions.spacing.medium,
  },
  backButtonText: {
    fontSize: 17,
    color: AppColors.textSecondary,
    marginLeft: AppDimensions.spacing.small,
  },
  headerTitle: {
    flex: 1,
    fontSize: AppDimensions.iconSize.title,
    fontWeight: 'bold',
    color: AppColors.text,
    textAlign: 'center',
    marginHorizontal: AppDimensions.spacing.small,
  },
  appLogoHeaderContainer: {

  },
  appLogoHeader: {
    width: AppDimensions.logo.small.width,
    height: AppDimensions.logo.small.height,
    resizeMode: 'contain',
  },
});