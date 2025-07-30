# GitHub Actions for Store Locator Blocks

This directory contains GitHub Actions workflows for managing the Store Locator blocks npm package.

## Workflows

### 1. `publish-blocks.yml` - Package Publishing

Automatically publishes the blocks package to GitHub Packages npm registry.

**Triggers:**
- **Push to main** (when `blocks/` directory changes) - Auto-publishes if version doesn't exist
- **Release published** - Publishes the package with the release version
- **Manual dispatch** - Allows manual publishing with version bump

**Manual Publishing:**
1. Go to Actions tab in GitHub
2. Select "Publish Store Locator Blocks to GitHub Packages"
3. Click "Run workflow"
4. Choose version bump type (patch/minor/major)
5. Run workflow

**Features:**
- ✅ Automatic version bumping (when manually triggered)
- ✅ Duplicate version detection
- ✅ GitHub Packages publishing
- ✅ Automatic git tagging and releases
- ✅ Proper npm authentication

### 2. `validate-blocks.yml` - Package Validation

Validates the blocks package structure and functionality.

**Triggers:**
- **Pull requests** affecting `blocks/` directory
- **Push to main** affecting `blocks/` directory

**Validations:**
- ✅ package.json structure and required fields
- ✅ Required files and directories exist
- ✅ postinstall.js script functionality
- ✅ Block structure validation
- ✅ README content validation
- ✅ Installation simulation

## Setup Requirements

### Repository Settings

1. **Enable GitHub Packages:**
   - Go to Repository Settings → Actions → General
   - Enable "Read and write permissions" for GITHUB_TOKEN

2. **Package Visibility:**
   - Published packages will be visible in the repository's Packages tab
   - Package name: `@blueacorninc/storefront-storelocator`

### Installation for Merchants

Once published, merchants can install with:

```bash
npm install @blueacorninc/storefront-storelocator
```

Or install from GitHub Packages specifically:

```bash
npm install @blueacorninc/storefront-storelocator --registry=https://npm.pkg.github.com
```

## Package Structure

The workflows expect this structure in the `blocks/` directory:

```
blocks/
├── package.json                 # npm package configuration
├── postinstall.js              # Auto-installation script
├── README.md                   # Package documentation
├── .npmignore                  # Files to exclude
├── store-locator/              # Store locator block
└── product-availability/       # Product availability block
```

## Versioning

- **Automatic**: Package version comes from `blocks/package.json`
- **Manual**: Workflow can bump version (patch/minor/major)
- **Tags**: Format `blocks-v1.0.0` to distinguish from app releases
- **Releases**: Auto-created for manual publishes
