import useAuth from 'hooks/useAuth';
import { createContext, useContext, useEffect, useState } from 'react';
import useGlobal from './GlobalProvider';

interface SpeechContext {
  message: string;
  transcript: string;
  recognition: SpeechRecognition;
  currentTranscript: string;
  isRecording: boolean;
}

const SpeechContext = createContext<SpeechContext>(null);

export default function useSpeechRecognition() {
  return useContext(SpeechContext);
}

export const SpeechProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition>();
  const [isRecording, setIsRecording] = useState(false);
  const { user } = useAuth();
  const { appliances, dispatch } = useGlobal();

  const grammarWords = ['fans', 'cctv', 'lights', 'ac', 'AC', 'CCTV'];
  const grammar = `#JSGF V1.0; grammar words; public <word> = ${grammarWords.join(
    ' | '
  )};`;

  const includes = (message: string, words: string[]) => {
    for (let word of words) {
      if (new RegExp(word, 'ig').test(message)) {
        return true;
      }
    }

    return false;
  };

  const respond = (message: string) => {
    let text = '';

    message = message.replace(/light$/, 'lights');

    if (includes(message, ['Hi', 'Hello', 'Hey'])) {
      text = `Hello ${user.name}, nice to meet you`;
    } else if (includes(message, ['Turn on', 'Turn on the'])) {
      const turnOn = message
        .replace(/Turn on( the)?/i, '')
        .trim()
        .toLowerCase();

      console.log(turnOn);
      if (appliances[turnOn] !== undefined) {
        dispatch({
          type: 'TURN_ON',
          payload: turnOn,
        });

        text = `Turned on ${turnOn}`;
      } else {
        text = `Device not found`;
      }
    } else if (includes(message, ['Turn off', 'Turn off the'])) {
      const turnOff = message
        .replace(/Turn off( the)?/i, '')
        .trim()
        .toLowerCase();

      if (appliances[turnOff] !== undefined) {
        dispatch({
          type: 'TURN_OFF',
          payload: turnOff,
        });

        text = `Turned off ${turnOff}`;
      } else {
        text = `Device not found`;
      }
    } else {
      text = "Sorry, I didn't understand that";
    }

    console.log(text);
    setMessage(text);
  };

  useEffect(() => {
    const speech = new SpeechSynthesisUtterance(message);

    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    setIsRecording(false);

    if (typeof window !== 'undefined') {
      window.speechSynthesis.speak(speech);
    }
  }, [message]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      ((window as any)
        .webkitSpeechRecognition as typeof window.SpeechRecognition);

    const SpeechGrammarList =
      window.SpeechGrammarList ||
      ((window as any)
        .webkitSpeechGrammarList as typeof window.SpeechGrammarList);

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();

    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-US';

    setRecognition(recognition);
  }, []);

  useEffect(() => {
    setTranscript(
      [transcript, currentTranscript]
        .map(t => t.trim())
        .join(' ')
        .trim()
    );
  }, [currentTranscript]);

  const handleStart = () => {
    console.log('START');
    setIsRecording(true);
  };

  const handleResult = (e: SpeechRecognitionEvent) => {
    console.log('RESULT');
    const current = e.resultIndex;
    const transcript = e.results[current][0].transcript;

    setCurrentTranscript(transcript);
    respond(transcript);
  };

  const handleEnd = () => {
    console.log('END');
    setIsRecording(false);
  };

  const handleNoMatch = () => {
    console.log('NO MATCH');
    setMessage("Sorry, I didn't understand that");
    setIsRecording(false);
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.addEventListener('start', handleStart);
    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('end', handleEnd);
    recognition.addEventListener('nomatch', handleNoMatch);

    return () => {
      recognition.removeEventListener('start', handleStart);
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('end', handleEnd);
      recognition.removeEventListener('nomatch', handleNoMatch);
    };
  }, [recognition, user]);

  const value: SpeechContext = {
    message,
    transcript,
    recognition,
    currentTranscript,
    isRecording,
  };

  return (
    <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
  );
};
