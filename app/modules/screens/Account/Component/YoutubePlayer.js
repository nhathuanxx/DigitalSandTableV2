import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const YouTubePlayer = ({ videoId, onReady, height }) => {
  onReady();
  return (
    <View style={[styles.container, { height: height }]}>
      <WebView
        source={{
          html: `
            <html>
              <body style="margin:0;padding:0;">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/${videoId}"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                ></iframe>
              </body>
            </html>
          `,
        }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default YouTubePlayer;
