import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const MicButton = ({ onTranscript, onStateChange }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        if (onStateChange) onStateChange(true);
      };

      rec.onend = () => {
        setIsListening(false);
        if (onStateChange) onStateChange(false);
      };

      rec.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognitionRef.current = rec;
    }
  }, [onTranscript, onStateChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Web Speech API is not supported in this browser. Please try Google Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`mic-btn ${isListening ? 'mic-active' : ''}`}
      type="button"
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-glass)',
        color: 'var(--text-main)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-premium)',
        transition: 'var(--transition)'
      }}
    >
      {isListening ? (
        <MicOff size={24} style={{ color: 'white' }} />
      ) : (
        <Mic size={24} style={{ color: 'var(--primary)' }} />
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .mic-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
      `}} />
    </button>
  );
};

export default MicButton;
