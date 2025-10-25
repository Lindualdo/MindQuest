#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

read -rsp "Informe o token N8N_API_KEY: " token
echo

if [[ -z "${token// }" ]]; then
  echo "Token vazio. Abortando."
  exit 1
fi

cleanup() {
  unset token
}
trap cleanup EXIT

(
  cd "$PROJECT_ROOT"
  N8N_API_KEY="$token" node "$SCRIPT_DIR/n8n-backup.mjs"
)

echo "Token limpo e backup finalizado."
