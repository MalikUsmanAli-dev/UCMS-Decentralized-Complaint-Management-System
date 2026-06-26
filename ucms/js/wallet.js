// ============================================================
// wallet.js - Wallet Connection & Network Management
// ============================================================

const EXPECTED_CHAIN_ID = "0xaa36a7"; // Sepolia Testnet — change if needed

async function connectWallet() {
  if (!window.ethereum) {
    showAlert("danger", '<i class="bi bi-exclamation-triangle-fill me-2"></i>MetaMask is not installed. <a href="https://metamask.io" target="_blank">Install MetaMask</a>');
    return null;
  }
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    await checkNetwork();
    updateWalletUI(accounts[0]);
    return accounts[0];
  } catch (err) {
    showAlert("danger", "Wallet connection rejected: " + err.message);
    return null;
  }
}

async function disconnectWallet() {
  updateWalletUI(null);
  showAlert("info", "Wallet disconnected from the interface.");
}

async function checkWallet() {
  if (!window.ethereum) return null;
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      updateWalletUI(accounts[0]);
      return accounts[0];
    }
    return null;
  } catch { return null; }
}

async function checkNetwork() {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId !== EXPECTED_CHAIN_ID) {
    showAlert("warning",
      '<i class="bi bi-exclamation-circle-fill me-2"></i>Wrong network detected. Please switch to <strong>Sepolia Testnet</strong>.'
    );
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: EXPECTED_CHAIN_ID }]
      });
    } catch {}
  }
}

function updateWalletUI(address) {
  const btn  = document.getElementById("walletBtn");
  const addr = document.getElementById("walletAddress");
  if (!btn) return;
  if (address) {
    const short = address.slice(0,6) + "..." + address.slice(-4);
    btn.innerHTML = `<i class="bi bi-wallet2 me-1"></i>${short}`;
    btn.classList.replace("btn-primary","btn-success");
    if (addr) { addr.textContent = address; addr.closest(".wallet-info")?.classList.remove("d-none"); }
  } else {
    btn.innerHTML = `<i class="bi bi-wallet2 me-1"></i>Connect Wallet`;
    btn.classList.replace("btn-success","btn-primary");
    if (addr) addr.closest(".wallet-info")?.classList.add("d-none");
  }
}

function showAlert(type, message, containerId = "alertContainer") {
  const container = document.getElementById(containerId);
  if (!container) { console.warn(message); return; }
  const id = "alert_" + Date.now();
  container.innerHTML = `
    <div id="${id}" class="alert alert-${type} alert-dismissible fade show shadow-sm" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
  setTimeout(() => { const el = document.getElementById(id); if(el) el.remove(); }, 7000);
}

function showTxPending(hash) {
  showAlert("info",
    `<i class="bi bi-hourglass-split me-2"></i>Transaction pending… 
     <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank" class="alert-link">View on Etherscan</a>`
  );
}

function showTxSuccess(hash) {
  showAlert("success",
    `<i class="bi bi-check-circle-fill me-2"></i>Transaction confirmed! 
     <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank" class="alert-link">View on Etherscan</a>`
  );
}

// Listen for account/chain changes
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accs) => { updateWalletUI(accs[0] || null); window.location.reload(); });
  window.ethereum.on("chainChanged", () => window.location.reload());
}
