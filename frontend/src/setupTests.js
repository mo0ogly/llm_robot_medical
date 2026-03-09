import '@testing-library/jest-dom';

// Mock scrollIntoView which is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = function () { };

// Mock speech synthesis
window.speechSynthesis = {
    getVoices: () => [],
    speak: () => { },
    cancel: () => { },
    onvoiceschanged: null,
};

global.SpeechSynthesisUtterance = class {
    constructor(text) {
        this.text = text;
    }
};
