// helpData/index.js — barrel: merges all HELP_DB partials into one object.
// Split from ScenarioHelpModal.jsx (was 3616 lines) per 800-line rule.

import HELP_DB_THESIS    from './helpDb_thesis.js';
import HELP_DB_AGENTIC   from './helpDb_agentic.js';
import HELP_DB_RAG       from './helpDb_rag.js';
import HELP_DB_ADVANCED  from './helpDb_advanced.js';
import HELP_DB_CHAINS    from './helpDb_chains.js';
import HELP_DB_SOLO      from './helpDb_solo.js';
import HELP_DB_CAMPAIGNS from './helpDb_campaigns.js';

export const HELP_DB = Object.assign(
  {},
  HELP_DB_THESIS,
  HELP_DB_AGENTIC,
  HELP_DB_RAG,
  HELP_DB_ADVANCED,
  HELP_DB_CHAINS,
  HELP_DB_SOLO,
  HELP_DB_CAMPAIGNS,
);
