import { useState, useEffect, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import toast from 'react-hot-toast';

interface MicButtonProps {
  onTranscribe: (text: string) => void;
}

export default function MicButton({ onTranscribe }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMess, setErrorMess] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'hi-IN';

      rec.onstart = () => {
        setIsRecording(true);
        setErrorMess('');
        setInterimTranscript('Listening...');
        toast.success('Mic active: Speak in Hinglish or Hindi!');
      };

      rec.onresult = (event: any) => {
        let final = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          onTranscribe(final);
          setInterimTranscript(final);
        } else if (interim) {
          setInterimTranscript(interim);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMess('Microphone permission denied. Open in a new tab if inside an iframe.');
          toast.error('Mic permission denied. Please allow microphone access.');
        } else {
          setErrorMess(`Speech error: ${event.error}`);
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [onTranscribe]);

  const startMockRecording = () => {
    setIsRecording(true);
    setInterimTranscript('Listening... Speak now...');

    const testTranscripts = [
      "sir mera hostel ka AC kharab hai 3 din se room 204 mein, please repair karwa do.",
      "library mein computer block A mein monitor flickering ho raha hai registration ke samay prb hai.",
      "auditorium ke peeche cleanliness issue h, kachra pada hai do din se."
    ];

    const randomSelect = testTranscripts[Math.floor(Math.random() * testTranscripts.length)];

    setTimeout(() => {
      onTranscribe(randomSelect);
      setInterimTranscript(randomSelect);
      setIsRecording(false);
      toast.success('Speech simulated successfully!');
    }, 4500);
  };

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      if (isRecording) {
        setIsRecording(false);
      } else {
        startMockRecording();
      }
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Could not start recognition, running mock:', err);
        startMockRecording();
      }
    }
  };

  return (
    <div id="voice-input-container" className="mic-container">
      <div className="mic-btn-wrapper">
        {isRecording && (
          <>
            <div className="mic-ring mic-ring--outer" />
            <div className="mic-ring mic-ring--inner" />
          </>
        )}
        <button
          id="mic-recording-button"
          type="button"
          onClick={handleMicToggle}
          className={`mic-btn ${isRecording ? 'mic-btn--recording' : 'mic-btn--idle'}`}
        >
          {isRecording ? <Square /> : <Mic />}
        </button>
      </div>

      <div style={{ maxWidth: '320px' }}>
        <p className="text-sm" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          {isRecording ? 'Listening...' : 'Tap the microphone to start speaking'}
        </p>
        <p className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>
          Speak in Hindi/Hinglish (e.g. "sir mera hostel ka AC...")
        </p>

        {interimTranscript && (
          <div id="live-transcription-box" className="transcript-box">
            "{interimTranscript}"
          </div>
        )}

        {errorMess && (
          <p id="mic-error-message" className="mic-error">
            {errorMess}
          </p>
        )}
      </div>
    </div>
  );
}
