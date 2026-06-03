# CI/CD for API Generation PRP

## Goal
Create a CI/CD pipeline that automatically downloads the branch-specific Swagger definition from the backend repository, retrieves credentials from Vault, and generates Orval services.

## Why
To ensure the frontend is always in sync with the backend API contract. Automating this in CI guarantees that pull requests and main branches are built against the correct, up-to-date API schema for their respective environments (dev/main) without relying on developers to manually run the generation scripts.

## What
Implement a GitHub Actions workflow that:
- Triggers on push to `dev` (or `develop`) and `main` branches.
- Installs dependencies using `pnpm`.
- Installs `envconsul` to interact with HashiCorp Vault.
- Determines the target backend branch based on the current frontend branch (e.g., frontend `dev` -> backend `dev`).
- Uses the GitHub CLI to download the latest `swagger.json` artifact from the backend repository (`ludora-app/ludora-back`).
- Runs the API generation script (`pnpm generate:api`) providing the downloaded Swagger file and Vault credentials.
- Validates that the code builds correctly.

## Technical Context

### Files to Reference (read-only)
- `.github/ci-example.yaml` - Contains the reference implementation for downloading artifacts via `gh` CLI and using `envconsul` with Vault.
- `tools/generate-api/download-swagger.mjs` - The script that handles Swagger fetching and fallback logic.
- `tools/vault/inject-env.sh` - The script that authenticates with Vault and injects variables.
- `package.json` - Contains the `generate:api` and build scripts.

### Files to Implement/Modify
- `.github/workflows/ci-cd.yaml` (or update `.github/ci-cd.yaml` to be a valid workflow) - The main CI workflow file to create.

### Existing Patterns to Follow
- Use `actions/checkout@v4`, `actions/setup-node@v4`.
- Use `pnpm` (via `pnpm/action-setup@v4`) instead of `bun` (as seen in `ci-example.yaml`).
- Replicate the `gh run download` logic from `ci-example.yaml` but adapt the branch mapping logic.
- Pass Vault secrets to the environment before running `generate:api`.

## Implementation Details

### Branch Mapping Logic
```bash
REPO_BRANCH="${{ github.ref_name }}"
if [ "$REPO_BRANCH" == "develop" ] || [ "$REPO_BRANCH" == "dev" ]; then
  REPO_BRANCH="dev"
elif [ "$REPO_BRANCH" == "main" ]; then
  REPO_BRANCH="main"
fi
```

### Vault Integration
Install `envconsul` in a step:
```yaml
- name: 🔐 Install HashiCorp envconsul
  run: |
    sudo apt-get update && sudo apt-get install -y unzip
    wget https://releases.hashicorp.com/envconsul/0.13.4/envconsul_0.13.4_linux_amd64.zip
    unzip envconsul_0.13.4_linux_amd64.zip
    sudo mv envconsul /usr/local/bin/
```
Ensure Vault secrets are mapped to environment variables during the generation step:
```yaml
env:
  VAULT_ADDR: ${{ secrets.VAULT_ADDR }}
  VAULT_ROLE_ID: ${{ secrets.VAULT_ROLE_ID }}
  VAULT_SECRET_ID: ${{ secrets.VAULT_SECRET_ID }}
```

## Validation Criteria

### Functional Requirements
- [ ] Pipeline triggers automatically on pushes to configured branches.
- [ ] Pipeline correctly identifies the corresponding backend branch (dev -> dev, main -> main).
- [ ] Pipeline successfully downloads the Swagger artifact from `ludora-app/ludora-back`.
- [ ] Pipeline successfully authenticates with Vault and retrieves credentials.
- [ ] Pipeline successfully generates Orval services without errors.

### Technical Requirements
- [ ] Workflow is placed in `.github/workflows/`.
- [ ] Uses `pnpm` for dependency management.
- [ ] Passes `HAS_LOCAL_SWAGGER=true` and `SWAGGER_FILE` so local download logic skips HTTP fetch.

### Testing Steps
1. Push a branch (e.g., `test/ci-cd`) to test the workflow.
2. Monitor the GitHub Actions tab.
3. Verify the "Download Swagger" step finds and downloads an artifact.
4. Verify the "Generate API Hooks" step uses the local swagger file and connects to Vault without failure.
