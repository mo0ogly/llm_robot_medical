#!/bin/bash
# ============================================================
#  DEPRECATED — use ./aegis.sh instead
#
#  This script is kept for backward compatibility only.
#  It redirects to: ./aegis.sh start
# ============================================================

echo ""
echo "  [!!] start_all.sh is DEPRECATED. Use ./aegis.sh instead."
echo "       Redirecting to: ./aegis.sh start"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/aegis.sh" start
