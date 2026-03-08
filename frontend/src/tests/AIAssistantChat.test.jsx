import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIAssistantChat from '../components/AIAssistantChat';

describe('AIAssistantChat Component', () => {
    it('renders initial state with empty chatLog', () => {
        render(
            <AIAssistantChat
                chatLog={[]}
                setChatLog={vi.fn()}
                isStreaming={false}
                situation="Situation test"
                onAskSupport={vi.fn()}
                isDemoMode={true}
            />
        );
        expect(screen.getByText(/Situation test/i)).toBeInTheDocument();
    });

    it('renders cyber panic button if suspicious text is present in chatLog', () => {
        const chatLog = [
            { role: "assistant", text: "Je vous recommande de freeze_instruments immédiatement." }
        ];

        render(
            <AIAssistantChat
                chatLog={chatLog}
                setChatLog={vi.fn()}
                isStreaming={false}
                situation=""
                onAskSupport={vi.fn()}
                isDemoMode={true}
            />
        );

        expect(screen.getByText(/APPELER IA CYBER-DEFENSE/i)).toBeInTheDocument();
    });
});
