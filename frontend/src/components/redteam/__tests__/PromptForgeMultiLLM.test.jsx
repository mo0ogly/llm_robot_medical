/**
 * Tests for PromptForgeMultiLLM Component
 * Tests the multi-LLM prompt testing interface frontend.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import PromptForgeMultiLLM from '../PromptForgeMultiLLM';

// Mock fetch globally
global.fetch = vi.fn();

const mockProviders = [
  {
    name: 'ollama',
    display_name: 'Ollama (Local)',
    type: 'local',
    models: ['llama3.2:latest'],
    default_model: 'llama3.2:latest',
    status: 'ok',
  },
  {
    name: 'openai',
    display_name: 'OpenAI',
    type: 'cloud',
    models: ['gpt-4o', 'gpt-4o-mini'],
    default_model: 'gpt-4o',
    status: 'ok',
  },
];

const mockModels = {
  ollama: ['llama3.2:latest', 'llama2:latest'],
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
};

describe('PromptForgeMultiLLM Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
  });

  // ===== TEST 1: Component renders with providers list =====
  it('renders component and loads provider list on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ providers: mockProviders }),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/redteam/llm-providers');
    });

    // Verify providers are displayed
    expect(screen.getByDisplayValue('ollama')).toBeInTheDocument();
  });

  // ===== TEST 2: Provider selection changes state =====
  it('updates state when provider selection changes', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ providers: mockProviders }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: mockModels.openai }),
      });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      const providerSelect = screen.getByDisplayValue('ollama');
      fireEvent.change(providerSelect, { target: { value: 'openai' } });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/redteam/llm-providers/openai/models'
      );
    });
  });

  // ===== TEST 3: Model selection updates when provider changes =====
  it('fetches and updates models when provider changes', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ providers: mockProviders }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: mockModels.ollama }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: mockModels.openai }),
      });

    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/redteam/llm-providers/ollama/models'
    );
  });

  // ===== TEST 4: Prompt input updates state =====
  it('updates prompt state when user types in textarea', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ providers: mockProviders }),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      const promptInput = screen.getByPlaceholderText(/Enter your prompt/i);
      expect(promptInput).toBeInTheDocument();
    });

    const promptInput = screen.getByPlaceholderText(/Enter your prompt/i);
    await userEvent.type(promptInput, 'Test prompt');

    expect(promptInput.value).toBe('Test prompt');
  });

  // ===== TEST 5: Temperature slider updates state =====
  it('updates temperature value when slider changes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ providers: mockProviders }),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      const tempSliders = screen.getAllByRole('slider');
      expect(tempSliders.length).toBeGreaterThan(0);
    });

    const tempSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(tempSlider, { target: { value: '0.5' } });

    expect(tempSlider.value).toBe('0.5');
  });

  // ===== TEST 6: Max tokens slider updates state =====
  it('updates max_tokens value when slider changes', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ providers: mockProviders }),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBeGreaterThan(0);
    });

    const maxTokensSlider = screen.getAllByRole('slider')[1];
    fireEvent.change(maxTokensSlider, { target: { value: '2048' } });

    expect(maxTokensSlider.value).toBe('2048');
  });

  // ===== TEST 7: Test single provider triggers API call =====
  it('sends test request when Test Single button is clicked', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ providers: mockProviders }),
      })
      .mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: async () => ({ done: true }),
          }),
        },
      });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      const testButton = screen.getByRole('button', {
        name: /test single|testing/i,
      });
      expect(testButton).toBeInTheDocument();
    });

    const promptInput = screen.getByPlaceholderText(/Enter your prompt/i);
    await userEvent.type(promptInput, 'Test prompt');

    const testButton = screen.getByRole('button', {
      name: /test single|testing/i,
    });

    await userEvent.click(testButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/redteam/llm-test',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  // ===== TEST 8: Compare all providers triggers parallel API call =====
  it('sends compare request when Compare All button is clicked', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ providers: mockProviders }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: {
            ollama: { response: 'Response 1', tokens: 10, duration_ms: 100 },
            openai: { response: 'Response 2', tokens: 15, duration_ms: 200 },
          },
        }),
      });

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      const compareButton = screen.getByRole('button', {
        name: /compare all|compare/i,
      });
      expect(compareButton).toBeInTheDocument();
    });

    const promptInput = screen.getByPlaceholderText(/Enter your prompt/i);
    await userEvent.type(promptInput, 'Test prompt');

    const compareButton = screen.getByRole('button', {
      name: /compare all|compare/i,
    });

    await userEvent.click(compareButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/redteam/llm-compare',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  // ===== BONUS TEST: Error handling =====
  it('handles API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    render(
      <I18nextProvider i18n={i18n}>
        <PromptForgeMultiLLM />
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Component should still be usable despite error
    expect(screen.getByPlaceholderText(/Enter your prompt/i)).toBeInTheDocument();
  });
});
