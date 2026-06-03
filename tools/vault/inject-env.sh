#!/usr/bin/env bash
set -euo pipefail

# 1. Charger .env.development s'il existe (local uniquement)
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

# 4. Déterminer le chemin du secret dynamiquement
# La racine peut être définie via VAULT_SECRET_ROOT (pratique pour réutiliser ce script dans d'autres projets)
SECRET_ROOT="${VAULT_SECRET_ROOT:-secret/ludora/admin-dashboard}"

if [ "${VERCEL:-}" = "1" ] || [ "${VERCEL:-}" = "true" ]; then
  # Sur Vercel, on utilise NODE_ENV pour déterminer le chemin
  ENV_NAME="${NODE_ENV:-development}"
  if [ "$ENV_NAME" = "development" ]; then
    DEFAULT_SECRET_PATH="$SECRET_ROOT/dev"
  elif [ "$ENV_NAME" = "production" ]; then
    DEFAULT_SECRET_PATH="$SECRET_ROOT/prod"
  else
    DEFAULT_SECRET_PATH="$SECRET_ROOT/$ENV_NAME"
  fi
else
  # En local ($VERCEL = 0 ou non défini)
  DEFAULT_SECRET_PATH="$SECRET_ROOT/localhost"
fi

# Permettre l'override manuel via VAULT_SECRET_PATH (sinon on prend le chemin calculé)
SECRET_PATH="${VAULT_SECRET_PATH:-$DEFAULT_SECRET_PATH}"

# 5. Récupérer les secrets via l'API REST de Vault
SECRETS_RESPONSE=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$SECRET_PATH")

# Vérifier si la réponse contient "errors"
if echo "$SECRETS_RESPONSE" | grep -q '"errors"'; then
  echo "❌ Erreur lors de la récupération des secrets pour le chemin : $SECRET_PATH"
  echo "   Réponse : $SECRETS_RESPONSE"
  exit 1
fi

# 6. Exporter ces variables dans le shell actuel via Node.js
# Utilisation de Node.js car il est disponible sur Vercel et en local (sans dépendre de jq ni d'envconsul)
export_script='
  try {
    const json = JSON.parse(process.argv[1]);
    const data = json.data;
    if (!data) process.exit(0);
    // Support KV V2 (data contient un sous-objet data) ou KV V1
    const secrets = data.data || data;
    for (const [k, v] of Object.entries(secrets)) {
      // Ne pas écraser les variables déjà définies dans lenvironnement (ex: Vercel NODE_ENV)
      if (process.env[k] === undefined) {
        console.log(`export ${k}="${v}"`);
      }
    }
  } catch (e) {
    console.error("❌ Erreur de parsing JSON", e);
    process.exit(1);
  }
'
eval "$(node -e "$export_script" "$SECRETS_RESPONSE")"

# 7. Vérifier qu'on a bien une commande à exécuter
if [ $# -eq 0 ]; then
  echo "⚠️ Aucune commande passée à inject-env.sh."
  echo "   Exemple : bash ./tools/vault/inject-env.sh pnpm run dev"
  exit 1
fi

# 8. Exécuter la commande demandée (pnpm, node, etc.)
exec "$@"

