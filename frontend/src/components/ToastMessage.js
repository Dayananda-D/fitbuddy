import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';

const TOAST_TYPE = {
  success: {
    backgroundColor: '#2ecc71',
    icon: 'check-circle',
  },
  error: {
    backgroundColor: '#e74c3c',
    icon: 'exclamation-circle',
  },
  info: {
    backgroundColor: '#3498db',
    icon: 'info-circle',
  },
  warning: {
    backgroundColor: '#f39c12',
    icon: 'exclamation-triangle',
  },
};

let toastRef = null;

const ToastMessage = forwardRef((_, ref) => {
  const [toastState, setToastState] = useState({
    isVisible: false,
    type: 'info',
    text: null,
    description: null,
    timeout: 1000,
  });

  const showToast = ({ type, text, description, timeout }) => {
    setToastState({
      isVisible: true,
      type,
      text,
      description,
      timeout,
    });

    setTimeout(() => {
      setToastState((prev) => ({ ...prev, isVisible: false }));
    }, timeout);
  };

  useImperativeHandle(ref, () => ({
    showToast,
  }));

  const { isVisible, type, text, description } = toastState;
  const backgroundColor = TOAST_TYPE[type]?.backgroundColor || TOAST_TYPE.info.backgroundColor;
  const icon = TOAST_TYPE[type]?.icon || TOAST_TYPE.info.icon;

  return (
    <>
      {isVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 50,
            left: 20,
            width: '90%',
            height: 100,
            backgroundColor,
            borderRadius: 10,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex:5
          }}
          entering={FadeInUp.delay(200)}
          exiting={FadeOutUp}
        >
          <FontAwesome5 name={icon} size={40} color="#FFF" />
          <View style={{ marginLeft: 12, width: '80%' }}>
            {text && (<Text style={{ fontSize: 18, fontWeight: '600', color: '#FFF' }}>{text}</Text>)}
            {description && (<Text style={{ fontSize: 16, fontWeight: '400', color: '#FFF' }}>{description}</Text>)}
          </View>
        </Animated.View>
      )}
    </>
  );
});

export const ToastService = {
  init(ref) {
    toastRef = ref;
  },
  show(type, text, description, timeout = 1000) {
    if (toastRef && toastRef.current) {
      toastRef.current.showToast({ type, text, description, timeout });
    }
  },
};

export default ToastMessage;
