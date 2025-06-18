import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');


const ProjectStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#3b5b16',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8a9831',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 16,
    top: 60,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 99
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectContainer: {
    flex: 1,
    padding: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  projectCardGrid: {
    width: (width - 64) / 3 - 3,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    padding: 8,
    overflow: 'hidden',
    marginHorizontal:6
    // alignItems: 'center',
  },
  gridContent: {
    width: (width - 64) / 3 - 48,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  projectCardList: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  thumbnailList: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  icon: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '500',

  },
  projectDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8c8c8c'
  },
  projectEdited: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8c8c8c'
  },
  listContent: {
    marginLeft: 12,
    flex: 1,
  },
});

export default ProjectStyles;