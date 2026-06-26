// ============================================================
// contract.js - Smart Contract Initialization (Ethers.js v6)
// ============================================================

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xb6B3EcB59034dd55afD4e9564A55BDe8F1e7a116";

let provider = null;
let signer = null;
let contract = null;

async function initContract() {
  if (!window.ethereum) throw new Error("MetaMask not found. Please install MetaMask.");
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
}

async function getReadOnlyContract() {
  if (!window.ethereum) throw new Error("MetaMask not found.");
  const roProvider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, roProvider);
}

const STATUS_LABELS = { 0:"Submitted", 1:"Under Review", 2:"In Progress", 3:"Resolved", 4:"Reopened" };
const STATUS_COLORS  = { 0:"primary",   1:"warning",      2:"info",        3:"success",  4:"danger" };
const PRIORITY_LABELS= { 0:"Low",       1:"Medium",       2:"High" };
const PRIORITY_COLORS= { 0:"success",   1:"warning",      2:"danger" };
const DEPARTMENTS    = ["Academic Affairs","Examination","Hostel","Library","Transport","Laboratory","Administration"];
