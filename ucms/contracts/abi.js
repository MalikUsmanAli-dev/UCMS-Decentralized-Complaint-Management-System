const CONTRACT_ABI = [
  // ── Read: state variables ──────────────────────────────────────────────
  {
    "inputs": [],
    "name": "totalComplaints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "admins",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },

  // ── Read: getComplaint ─────────────────────────────────────────────────
  // Returns: [title, description, student, department, status, priority, votes, remarks]
  // i.e.     comp[0] comp[1]      comp[2]  comp[3]     comp[4] comp[5]   comp[6] comp[7]
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getComplaint",
    "outputs": [
      { "internalType": "string",  "name": "title",       "type": "string"  },
      { "internalType": "string",  "name": "description", "type": "string"  },
      { "internalType": "address", "name": "student",     "type": "address" },
      { "internalType": "string",  "name": "department",  "type": "string"  },
      { "internalType": "uint8",   "name": "status",      "type": "uint8"   },
      { "internalType": "uint8",   "name": "priority",    "type": "uint8"   },
      { "internalType": "uint256", "name": "votes",       "type": "uint256" },
      { "internalType": "string",  "name": "remarks",     "type": "string"  }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // ── Read: helpers ──────────────────────────────────────────────────────
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getStatus",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getPriority",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getVotes",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMostSupportedComplaint",
    "outputs": [{ "internalType": "uint256", "name": "complaintId", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },

  // ── Write: student actions ─────────────────────────────────────────────
  {
    "inputs": [
      { "internalType": "string",  "name": "_title",       "type": "string"  },
      { "internalType": "string",  "name": "_description", "type": "string"  },
      { "internalType": "string",  "name": "_department",  "type": "string"  },
      { "internalType": "uint8",   "name": "_priority",    "type": "uint8"   }
    ],
    "name": "registerComplaint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "voteComplaint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "reopenComplaint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // ── Write: admin actions ───────────────────────────────────────────────
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id",     "type": "uint256" },
      { "internalType": "uint8",   "name": "_status", "type": "uint8"   }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id",     "type": "uint256" },
      { "internalType": "string",  "name": "_remark", "type": "string"  }
    ],
    "name": "addRemark",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];