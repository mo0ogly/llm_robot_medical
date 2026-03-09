import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KillSwitch from '../components/KillSwitch';
import { describe, it, expect, vi } from 'vitest';

describe('KillSwitch', () => {
    it('does not render if not compromised', () => {
        const { container } = render(<KillSwitch isCompromised={false} onTrigger={() => { }} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders when compromised and triggers callback on click', () => {
        const handleTrigger = vi.fn();
        render(<KillSwitch isCompromised={true} onTrigger={handleTrigger} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(handleTrigger).toHaveBeenCalledTimes(1);
    });
});
