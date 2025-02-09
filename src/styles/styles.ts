import {StyleSheet} from 'react-native';
import colors from '@/config/locals/colors.locals';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 20},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categorySelector: {flexDirection: 'row', alignItems: 'center'},
  categoryText: {fontSize: 18, fontWeight: 'bold', marginLeft: 10},
  themeSwitch: {flexDirection: 'row', gap: 10},
  themeIconWrapper: {padding: 10, borderRadius: 20, backgroundColor: '#FFC72C'},
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  actionText: {color: colors.CFFF, fontWeight: 'bold'},
  sectionTitle: {fontSize: 20, fontWeight: 'bold', marginVertical: 30},
  timerList: {flexDirection: 'column', gap: 10},
  // timerCard: {backgroundColor: '#FFC72C', padding: 15, borderRadius: 15},
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timerTitle: {fontWeight: 'bold', fontSize: 18},
  timerStatusPaused: {color: colors.CF44F60, fontWeight: 'bold'},
  progressBar: {marginTop: 10},
  timeLeft: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.CFFF,
    textAlign: 'center',
  },
  icon: {width: 24, height: 24},
  startAll: {
    backgroundColor: colors.C218D4E,
    paddingVertical: 10,
    width: 100,
    borderRadius: 20,
    alignItems: 'center',
  },
  pauseAll: {
    backgroundColor: colors.CF44F60,
    paddingVertical: 10,
    width: 100,
    borderRadius: 20,
    alignItems: 'center',
  },
  restartAll: {
    backgroundColor: colors.CF29D38,
    paddingVertical: 10,
    width: 100,
    borderRadius: 20,
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10, // Adds space between icons
    alignItems: 'center',
  },
  halfAlertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfAlertText: {
    color: colors.CFFF,
    marginRight: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: colors.CFFC837,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.C000000,
    shadowOffset: {width: 0, height: 0}, // No directional shadow
    shadowOpacity: 0.5, // Increase for a stronger shadow
    shadowRadius: 10, // Spreads shadow radially
    elevation: 15, // Android shadow effect
  },
  floatingIcon: {
    width: 30,
    height: 30,
    tintColor: colors.CFFF, // Makes the icon white
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: colors.CFFC837,
    paddingVertical: 10,
    width: 200,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
    zIndex: 3,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.CFFF,
  },
  timerCard: {
    backgroundColor: '#FFC72C',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    // transition: 'height 0.3s ease-in-out', // Smooth height change
  },
  expandedTimerCard: {
    minHeight: 150, // Adjust height when expanded
  },
});

export default styles;
