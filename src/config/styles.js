import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8a0b07',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8a0b07',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#8a0b07',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '80%',
  },
});
