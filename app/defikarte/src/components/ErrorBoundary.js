import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // ToDo: Log to backend 
    console.log(`${error}, ${errorInfo}`);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI      
      return (
        <View style={styles.containerStyle}>
          <Text style={styles.errorTextStyle}>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  },
  errorTextStyle: {
    margin: 20,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default ErrorBoundary;