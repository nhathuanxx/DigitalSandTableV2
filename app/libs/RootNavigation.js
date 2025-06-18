import * as React from 'react';

// Tạo một ref để lưu trữ tham chiếu tới NavigationContainer
export const navigationRef = React.createRef();

// Hàm navigate để điều hướng từ bất kỳ đâu
export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}