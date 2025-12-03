import { useCallback } from 'react';

import { useConfig } from './useConfig';

export const useTelemetry = () => {
  const { features } = useConfig();

  const logEvent = useCallback(
    async (eventName, eventData = {}) => {
      // Only log if telemetry is enabled
      if (!features.telemetry) {
        return;
      }

      try {
        const event = {
          event: eventName,
          timestamp: new Date().toISOString(),
          sessionId: getSessionId(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...eventData,
        };

        // Send to telemetry endpoint
        const response = await fetch('/api/telemetry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          console.warn('Telemetry logging failed:', response.status);
        }
      } catch (error) {
        console.warn('Telemetry logging error:', error);
      }
    },
    [features.telemetry]
  );

  const logError = useCallback(
    (error, context = {}) => {
      logEvent('error', {
        error: error.message,
        stack: error.stack,
        ...context,
      });
    },
    [logEvent]
  );

  const logSecurityEvent = useCallback(
    (eventType, details = {}) => {
      logEvent('security_event', {
        type: eventType,
        ...details,
      });
    },
    [logEvent]
  );

  // Generate or retrieve session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('telemetry_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('telemetry_session_id', sessionId);
    }
    return sessionId;
  };

  return {
    logEvent,
    logError,
    logSecurityEvent,
    isEnabled: features.telemetry,
  };
};
