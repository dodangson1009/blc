# Restore Project to Original State

## Goal

Khôi phục toàn bộ dự án về trạng thái gốc (commit `f52a258` - "✅ add entire app"). Hoàn tác tất cả thay đổi chưa commit, xóa tất cả file mới được tạo trong session này, và cài lại dependencies.

---

## Current State Analysis

### Git History
- **Sole commit:** `f52a258` — "✅ add entire app"
- **Branch:** `main` (up to date with `origin/main`)
- **No stashes, no other branches**

### Scope of Changes to Revert

| Category | Count | Description |
|----------|-------|-------------|
| **Deleted tracked files** | ~47 | Assets (PNG, SVG), components (chat, chatCard, buttons, etc.), smart_contract/ directory, CODEOWNERS |
| **Modified tracked files** | ~15 | context.js, header.js, cmcTable.js, _app.js, getTopTen.js, info.js, index.js, globals.css, package.json, next.config.js, etc. |
| **New untracked files** | ~13 | TransactionHistory.js, WalletProvider.js, modals/, pages/api/getCoinChart.js, getCoinDetail.js, getSimilarCoins.js, pages/send.js, transfer.js, watchlist.js, vanguard-app/, spec files, package-lock.json |
| **Directories to remove** | ~3 | vanguard-app/, node_modules/ (reinstall) |

---

## Detailed File Inventory

### 1. Files to DELETE (untracked new files)

```
components/TransactionHistory.js
components/WalletProvider.js
components/modals/SwapCryptoModal.js
pages/api/getCoinChart.js
pages/api/getCoinDetail.js
pages/api/getSimilarCoins.js
pages/send.js
pages/transfer.js
pages/watchlist.js
vanguard-app/                          (entire directory)
remove-unnecessary-features-spec.md
blockchain-logic-spec.md
blockchain-security-spec.md
coin-detail-redesign-spec.md
fix-all-errors-spec.md
full-cleanup-spec.md
```

### 2. Files to RESTORE (modified tracked files → revert to commit state)

```
components/cmc-table/cmcTable.js
components/cmc-table/cmcTableHeader.js
components/cmc-table/cmcTableRow.js
components/cmc-table/coinNameRow.js
components/cmc-table/rate.js
components/cmc-table/incrementRate.js
components/cmc-table/cmcTableTitle.js
components/coinNameRow.js
components/buttons/dropDownBtn.js
components/graph.js
components/header.js
components/swapCryptoModal.js
components/transfers/CoinTransfer.js
components/transfers/Send.js
context/context.js
lib/constants.js
next.config.js
package.json
pages/_app.js
pages/index.js
pages/currencies/info.js
pages/api/getTopTen.js
styles/globals.css
assets/svg/info.js
assets/svg/more.js
```

### 3. Files to RESTORE (deleted tracked files → re-create from commit)

```
assets/avalanche.png
assets/bnb.png
assets/btc.png
assets/cardano.png
assets/converter.png
assets/diamond.png
assets/eth.png
assets/fire.png
assets/gainers.png
assets/recent.png
assets/shiba.png
assets/solana.png
assets/tera.png
assets/usdc.png
assets/usdt.png
assets/xrp.png
assets/svg/chevronDown.js
assets/svg/chevronUp.js
assets/svg/comment.js
assets/svg/guest.js
assets/svg/heart.js
assets/svg/moreHorizontal.js
assets/svg/rightArrow.js
assets/svg/search.js
assets/svg/share.js
assets/svg/star.js
assets/svg/usd.js
components/.DS_Store
components/Account/config.js
components/Account/icons/coin98.png
components/Account/icons/mathWallet.svg
components/Account/icons/metamaskWallet.png
components/Account/icons/safePal.svg
components/Account/icons/tokenPocket.svg
components/Account/icons/trustWallet.png
components/Account/icons/walletConnect.svg
components/bearishFilled.js
components/bullishFilled.js
components/button.js
components/buttons/bearishFilled.js
components/buttons/bullishFilled.js
components/buttons/rateFilled.js
components/chat.js
components/chatCard.js
components/cmcTable.js
components/coinDetails.js
components/moreButton.js
components/priceConverter.js
components/trending.js
components/trendingCard.js
components/trendingCardRow.js
components/priceConverter.js
CODEOWNERS
context/gunContext.js
hooks/useERC20Balance.js
pages/api/createuser.js
pages/api/getCurrentUserData.js
pages/api/tokenTransfer.js
pages/currencies/price.js
smart_contract/                        (entire directory)
  .DS_Store
  .gitignore
  README.md
  contracts/Dai.sol
  contracts/Dogecoin.sol
  contracts/Link.sol
  contracts/Usdc.sol
  hardhat.config.js
  package.json
  scripts/deploy.js
  test/sample-test.js
styles/Home.module.css
lib/Dai.json
lib/Doge.json
lib/Link.json
lib/Usdc.json
```

### 4. Directories to REMOVE

```
vanguard-app/
node_modules/          (will be reinstalled)
.next/                 (Next.js cache)
```

---

## Execution Steps

### Step 1: Kill any running dev servers
```bash
taskkill /F /IM node.exe 2>/dev/null || true
```

### Step 2: Remove untracked files and directories
```bash
# Remove specific untracked directories
rm -rf vanguard-app/
rm -rf .next/

# Remove specific untracked files
rm -f components/TransactionHistory.js
rm -f components/WalletProvider.js
rm -rf components/modals/
rm -f pages/api/getCoinChart.js
rm -f pages/api/getCoinDetail.js
rm -f pages/api/getSimilarCoins.js
rm -f pages/send.js
rm -f pages/transfer.js
rm -f pages/watchlist.js
rm -f remove-unnecessary-features-spec.md
rm -f blockchain-logic-spec.md
rm -f blockchain-security-spec.md
rm -f coin-detail-redesign-spec.md
rm -f fix-all-errors-spec.md
rm -f full-cleanup-spec.md
rm -f .env.example
rm -f nul
```

### Step 3: Restore modified tracked files to original commit state
```bash
git checkout f52a258 -- .
```
This single command restores ALL tracked files (modified AND deleted) to the exact state of commit `f52a258`.

### Step 4: Clean up any remaining untracked files
```bash
git clean -fd
```
This removes any untracked files that were missed.

### Step 5: Remove node_modules and package-lock.json, then reinstall
```bash
rm -rf node_modules/
rm -f package-lock.json
yarn install
# or: npm install
```

### Step 6: Verify restoration
```bash
git status          # Should show clean working tree
git diff HEAD       # Should show nothing
```

### Step 7: Start dev server and verify
```bash
npm run dev
# Navigate to http://localhost:3000 and verify the app loads correctly
```

---

## Key Decisions (from user interview)

| Decision | User's Choice |
|----------|---------------|
| **Restoration scope** | Khôi phục hoàn toàn — revert ALL changes |
| **New files** | Xóa hết file mới — delete all untracked files |
| **node_modules** | Xóa và cài lại — delete and reinstall |
| **Purpose** | Khôi phục lại trạng thái cũ — restore original state |

---

## Expected Outcome

After restoration:
- ✅ All source files match commit `f52a258` exactly
- ✅ All new components (TransactionHistory, WalletProvider, modals, etc.) are removed
- ✅ All deleted original files (chat.js, chatCard.js, trending.js, etc.) are restored
- ✅ All modified files (header.js, context.js, cmcTable.js, etc.) are reverted
- ✅ Smart contract directory is restored
- ✅ All asset images and SVGs are restored
- ✅ node_modules is freshly installed
- ✅ Working tree is clean (`git status` shows nothing)

---

## Risk Assessment

- **Low risk:** This is a clean revert to a known working state (the initial commit)
- **Data loss:** All work done during this session will be permanently lost (unless backed up elsewhere)
- **Reversibility:** The session work exists in the git diff history, so individual changes could theoretically be cherry-picked later if needed
