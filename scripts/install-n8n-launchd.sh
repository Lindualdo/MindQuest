#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PLIST_NAME="com.mindquest.n8n-backup.plist"
PLIST_SOURCE="$PROJECT_ROOT/scripts/$PLIST_NAME"
PLIST_TARGET="$HOME/Library/LaunchAgents/$PLIST_NAME"

if [[ ! -f "$PLIST_SOURCE" ]]; then
  echo "Arquivo plist não encontrado em $PLIST_SOURCE."
  exit 1
fi

echo "Instalando launch agent em $PLIST_TARGET"
mkdir -p "$HOME/Library/LaunchAgents"

if launchctl list | grep -q "com.mindquest.n8n-backup"; then
  echo "Atualizando agente existente (descarregando)."
  launchctl unload "$PLIST_TARGET" || true
fi

cp "$PLIST_SOURCE" "$PLIST_TARGET"
chmod 644 "$PLIST_TARGET"

echo "Carregando agente..."
launchctl load "$PLIST_TARGET"

echo "Agendado. Logs em ~/Library/Logs/mindquest-n8n-backup.log"
launchctl list | grep "com.mindquest.n8n-backup" || true
