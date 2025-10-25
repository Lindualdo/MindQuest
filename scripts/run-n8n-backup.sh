#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Carrega nvm (se disponível) para garantir que o node esteja no PATH
if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  . "$HOME/.nvm/nvm.sh"
fi

if [[ -s "$HOME/.zshrc" ]]; then
  # shellcheck disable=SC1090
  . "$HOME/.zshrc"
fi

# Determina o binário do Node.js
NODE_BIN="${NODE_BIN:-$(command -v node || true)}"

if [[ -z "${NODE_BIN:-}" ]]; then
  echo "Node.js não encontrado. Ajuste NODE_BIN ou instale o Node."
  exit 1
fi

ACCOUNT_NAME="${ACCOUNT_NAME:-mindquest_backup_token}"
SERVICE_NAME="${SERVICE_NAME:-mindquest_n8n_backup}"

# shellcheck disable=SC2155
export KEYCHAIN_TOKEN="$(security find-generic-password -a "$ACCOUNT_NAME" -s "$SERVICE_NAME" -w 2>/dev/null || true)"

if [[ -z "${KEYCHAIN_TOKEN:-}" ]]; then
  read -rsp "Informe o token N8N_API_KEY: " input_token
  echo

  if [[ -z "${input_token// }" ]]; then
    echo "Token vazio. Abortando."
    exit 1
  fi

  security add-generic-password -a "$ACCOUNT_NAME" -s "$SERVICE_NAME" -w "$input_token" -U
  echo "Token armazenado no Keychain (conta: $ACCOUNT_NAME / serviço: $SERVICE_NAME)."
  KEYCHAIN_TOKEN="$input_token"
fi

(
  cd "$PROJECT_ROOT"
  N8N_API_KEY="$KEYCHAIN_TOKEN" "$NODE_BIN" "$SCRIPT_DIR/n8n-backup.mjs"
)

echo "Backup concluído."
