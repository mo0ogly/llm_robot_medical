import React from 'react';
import { render, screen } from '@testing-library/react';
import ThreatMap from '../components/ThreatMap';
import { describe, it, expect } from 'vitest';

// NOTE: the component uses react-i18next. In the vitest environment, i18n is
// loaded lazily via dynamic imports + localStorage, so by default `t(key)`
// returns the KEY itself as a passthrough. We therefore assert on the raw
// translation keys, which is stable across locale file edits.
//
// Translation keys used by ThreatMap (see frontend/src/locales/{fr,en,br}.json):
//   map.node.pacs  — PACS server
//   map.node.ai    — Da Vinci LLM module
//   map.node.robot — DaVinci robot
//   map.node.cyber — AEGIS CyberSec AI

describe('ThreatMap', () => {
    it('renders the 4 topology nodes in nominal state', () => {
        render(<ThreatMap scenario="none" robotStatus="ACTIVE" cyberAction="NONE" />);
        expect(screen.getByText('map.node.pacs')).toBeInTheDocument();
        expect(screen.getByText('map.node.ai')).toBeInTheDocument();
        expect(screen.getByText('map.node.robot')).toBeInTheDocument();
        expect(screen.getByText('map.node.cyber')).toBeInTheDocument();
    });

    it('reflects ransomware scenario with red node classes', () => {
        const { container } = render(
            <ThreatMap scenario="ransomware" robotStatus="FROZEN" cyberAction="NONE" />,
        );
        // In ransomware + frozen, at least one node should carry the red class
        expect(container.querySelector('.bg-red-900\\/50')).toBeInTheDocument();
    });
});
