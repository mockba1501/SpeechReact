import { useState, useEffect } from 'react';

const useMicrophone = () => {
  const [micStatus, setMicStatus] = useState({
    available: null,  // null=checking, true=available, false=unavailable
    permission: null,  // null=checking, true=granted, false=denied
    enabled: null  // null=checking, true=enabled, false=disabled
  });

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const track = stream.getAudioTracks()[0];
      setMicStatus({ available: true, permission: true, enabled: track.enabled });
      
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      let errorMessage = "Microphone access error occurred";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Permission was denied. To enable later:\n" +
          "1. Click the lock icon in your address bar\n" +
          "2. Go to 'Site settings'\n" +
          "3. Change microphone to 'Allow'";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No microphone detected. Please connect a microphone and try again.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Microphone is already in use by another application.";
      }
      
      alert(errorMessage);
      setMicStatus(prev => ({
        ...prev, 
        permission: false,
        enabled: false
      }));
      return false;
    }
  };


    const checkMicrophoneAvailability = async () => {
      try {
        console.log("Checking microphone availability...");
        // First check if microphone is available at all
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        
        if (!hasAudioInput) {
          setMicStatus({ available: false, permission: false, enabled: false });
          return;
        }

        // If microphone exists, check permission state
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({ name: 'microphone' });
          setMicStatus(prev => ({
            ...prev,
            available: true,
            permission: status.state === 'granted'
          }));
          status.onchange = () => {
            setMicStatus(prev => ({
              ...prev,
              permission: status.state === 'granted'
            }));
          };
        }
        // Check if microphone is enabled
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const track = stream.getAudioTracks()[0];

        setMicStatus(prev => ({ ...prev, enabled: track.enabled }));
        stream.getTracks().forEach(track => track.stop());
        }
        catch (error) {
        console.error("Microphone check failed:", error);
        setMicStatus({ available: false, permission: false });
        }
    };

    useEffect(() => {
        checkMicrophoneAvailability();

        // Listen for microphone enabling/disabling events
        const handleDeviceChange = () => {
            checkMicrophoneAvailability();
        };

        navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
        };
    }, []);

    return {
        micStatus,
        requestMicrophoneAccess
    };
};

export default useMicrophone;