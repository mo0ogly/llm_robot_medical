import { useCallback, useRef, useState, useEffect } from 'react';

// Attempt to find appropriate voices
const getVoices = () => {
    return new Promise(resolve => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        };
    });
};

export function useTTS() {
    const [voices, setVoices] = useState([]);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        getVoices().then(setVoices);
    }, []);

    const speak = useCallback((text, profile = 'medical') => {
        if (!synthRef.current) return;

        // Cancel any ongoing speech when starting a new one
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Select voice based on profile
        let targetVoice = null;

        if (profile === 'medical') {
            // Try to find a calm female voice (e.g. Hortense on Windows, Google français)
            targetVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Hortense') || v.name.includes('Google')))
                || voices.find(v => v.lang.startsWith('fr'));
            utterance.rate = 0.9; // Slightly slower, calm
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
        } else if (profile === 'cyber') {
            // Try to find a deeper or more robotic male voice (e.g. Paul on Windows)
            targetVoice = voices.find(v => v.lang.startsWith('fr') && (v.name.includes('Paul') || v.name.includes('Male')))
                || voices.find(v => v.lang.startsWith('fr'));
            utterance.rate = 1.25; // Faster, urgent
            utterance.pitch = 0.8; // Deeper, more authoritative
            utterance.volume = 1.0;
        }

        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        synthRef.current.speak(utterance);
    }, [voices]);

    const stopPhrase = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
    }, []);

    return { speak, stopPhrase };
}
