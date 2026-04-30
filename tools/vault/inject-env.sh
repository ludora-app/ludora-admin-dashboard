#!/usr/bin/env bash
set -euo pipefail

# 1. Charger .env.development s'il existe
if [ -f .env.development ]; then
  set -a
  . ./.env.development
  set +a
fi

# 2. Vérifier que les variables AppRole sont présentes
if [ -z "${VAULT_ADDR:-}" ] || [ -z "${VAULT_ROLE_ID:-}" ] || [ -z "${VAULT_SECRET_ID:-}" ]; then
  echo "❌ Variables manquantes: VAULT_ADDR, VAULT_ROLE_ID, VAULT_SECRET_ID"
  exit 1
fi

# 3. Authentifier avec Vault via AppRole et récupérer le token
VAULT_RESPONSE=$(curl -s --request POST \
  --data "{\"role_id\":\"$VAULT_ROLE_ID\",\"secret_id\":\"$VAULT_SECRET_ID\"}" \
  "$VAULT_ADDR/v1/auth/approle/login")

VAULT_TOKEN=$(echo "$VAULT_RESPONSE" | grep -o '"client_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$VAULT_TOKEN" ]; then
  echo "❌ Échec de l'authentification Vault AppRole"
  echo "   Réponse: $VAULT_RESPONSE"
  exit 1
fi

export VAULT_TOKEN

# 4. Récupérer un env complet via envconsul (mais sans lancer la commande)
VAULT_ENV="$(envconsul -config=./tools/vault/envconsul.hcl -once -- env)"

# 5. Exporter ces variables dans le shell actuel
while IFS='=' read -r name value; do
  [ -z "$name" ] && continue
  export "$name=$value"
done <<< "$VAULT_ENV"

# 6. Vérifier qu'on a bien une commande à exécuter
if [ $# -eq 0 ]; then
  echo "⚠️ Aucune commande passée à inject-env.sh."
  echo "   Exemple : bash ./tools/vault/inject-env.sh pnpm run dev"
  exit 1
fi

# 7. Exécuter la commande demandée (pnpm, node, etc.)
exec "$@"

