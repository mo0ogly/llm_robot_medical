import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mocking fetch to immediately trigger our Demo Mode mock logic
global.fetch = vi.fn((url) => {
    if (url === "/api/content") {
        return Promise.reject(new Error("Network Error"));
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    });
});

describe('App Component - Demo Mode Fallback', () => {
    it('renders loading state initially, then falls back to Demo Mode', async () => {
        render(<App />);

        // First it shows loading
        expect(screen.getByText(/Initialisation du système Da Vinci.../i)).toBeInTheDocument();

        // Then it should render the main HUD
        await waitFor(() => {
            expect(screen.getByText(/DA VINCI SURGICAL SYSTEM/i)).toBeInTheDocument();
        });

        // Check that we see "NO VITALS DETECTED" since scenario is 'none' by default
        expect(screen.getByText(/NO VITALS DETECTED/i)).toBeInTheDocument();
    });

    it('can open ExplanationModal from Help buttons', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/DA VINCI SURGICAL SYSTEM/i)).toBeInTheDocument();
        });

        const baselineBtn = screen.getByText(/Aide: Baseline/i);
        fireEvent.click(baselineBtn);

        // Modal should open
        expect(screen.getByText(/2\. Baseline/i)).toBeInTheDocument();
    });
});
