// wallet-claim.js

const CONTRACT_ADDRESS = "0x1F8b43F7aeD0D1b524Ec5b4930C19098E8D4fbD0";
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name_", "type": "string" },
      { "internalType": "string", "name": "symbol_", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "spender", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask to connect your wallet.");
    return null;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } catch (err) {
    console.error("Failed to connect to MetaMask:", err);
    return null;
  }
}

async function getCodeBalance(address) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatUnits(balance, 18);
}

async function claimCodeTokens(amount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  try {
    const tx = await contract.transfer(signer.getAddress(), ethers.utils.parseUnits(amount.toString(), 18));
    await tx.wait();
    alert(`✅ Claimed ${amount} CODE!`);
  } catch (err) {
    console.error("Claim failed:", err);
    alert("❌ Claim failed.");
  }
}

// Hook up DOM (optional if needed in your HTML)
document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connect-wallet");
  const balanceDisplay = document.getElementById("code-balance");
  const claimBtn = document.getElementById("claim-rewards");

  let userAddress;

  connectBtn?.addEventListener("click", async () => {
    userAddress = await connectWallet();
    if (userAddress) {
      document.getElementById("wallet-address").textContent = `Connected: ${userAddress}`;
      const balance = await getCodeBalance(userAddress);
      balanceDisplay.textContent = `${balance} CODE`;
      claimBtn.disabled = false;
    }
  });

  claimBtn?.addEventListener("click", async () => {
    const claimAmount = 5; // hardcoded claim for MVP
    await claimCodeTokens(claimAmount);
    const balance = await getCodeBalance(userAddress);
    balanceDisplay.textContent = `${balance} CODE`;
  });
});
