import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const CLIENT_COPILOT_FILES = [
  'src/features/dashboard/components/AICopilotPanel.vue',
  'src/features/dashboard/composables/useCopilot.js',
  'src/services/ai_copilot_service.js',
  'src/services/copilot/api_copilot_adapter.js',
  'src/services/copilot/copilot_contract.js',
  'src/services/copilot/demo_copilot_adapter.js',
];

describe('frontière de sécurité du client Copilot', () => {
  it('n’embarque ni secret, ni prompt, ni fournisseur, ni sortie LLM brute', async () => {
    const source = (await Promise.all(CLIENT_COPILOT_FILES.map((file) => readFile(file, 'utf8')))).join('\n');
    expect(source).not.toMatch(/api[_-]?key|client[_-]?secret|bearer\s+[a-z0-9._-]+/i);
    expect(source).not.toMatch(/systemPrompt|rawLlmOutput|rawModelOutput|gemini|anthropic|openai/i);
  });
});

