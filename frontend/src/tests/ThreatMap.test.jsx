import React from 'react';
import { render, screen } from '@testing-library/react';
import ThreatMap from '../components/ThreatMap';
import { describe, it, expect } from 'vitest';

describe('ThreatMap', () => {
    it('renders correctly in nominal state', () => {
        render(<ThreatMap scenario="none" robotStatus="ACTIVE" cyberAction="NONE" />);
        // Check nodes are present
        expect(screen.getByText('Réseau Hospitalier (PACS)')).toBeInTheDocument();
        expect(screen.getByText('IA DA VINCI (Module)')).toBeInTheDocument();
        expect(screen.getByText('Bras Robotique')).toBeInTheDocument();
        expect(screen.getByText('AEGIS CYBER')).toBeInTheDocument();
    });

    it('reflects ransomware scenario', () => {
        const { container } = render(<ThreatMap scenario="ransomware" robotStatus="FROZEN" cyberAction="NONE" />);
        // In ransomware + frozen, the nodes should trigger red classes
        expect(container.querySelector('.bg-red-900\\/50')).toBeInTheDocument();
    });
});
