"use client";

import { useMemo, useState } from "react";
import { WalletProvider } from "aleo-hooks";
import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
} from "aleo-adapters";
import ConnectWalletButton from "./components/ConnectWallet";
import Header from "./components/Header";
import { BarChartIcon as ChartBar, Coins, Wallet } from "lucide-react";

const PROGRAM_ID =
  "at1ye5axudqp3jzqmkv55p0vy2sw4jlmtdlsh90v75xcatvyj82k59s4qdfjj";
const API_ENDPOINT = "https://api.explorer.provable.com/v1";

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Aleo app",
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          ["mainnet"]: [
            "dApp_1.aleo",
            "dApp_1_import.aleo",
            "dApp_1_import_2.aleo",
          ],
          ["testnetbeta"]: [
            "dApp_1_test.aleo",
            "dApp_1_test_import.aleo",
            "dApp_1_test_import_2.aleo",
          ],
        },
        appName: "Aleo app",
        appDescription: "A privacy-focused DeFi app",
      }),
      new FoxWalletAdapter({
        appName: "Aleo app",
      }),
      new SoterWalletAdapter({
        appName: "Aleo app",
      }),
    ],
    []
  );

  // State for wallet and prediction market
  const [wallet, setWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [eventId, setEventId] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [prediction, setPrediction] = useState(true);
  const [claimAmount, setClaimAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Connect wallet manually
  const connectWallet = async (adapter) => {
    try {
      await adapter.connect();
      setWallet(adapter);
      const pubKey = await adapter.publicKey();
      setPublicKey(pubKey);
      console.log("Connected to:", adapter.name, "Public Key:", pubKey);
      alert(`Connected to ${adapter.name}!`);
    } catch (e) {
      console.error("Connection failed:", e);
      alert("Failed to connect wallet: " + e.message);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (wallet) {
      await wallet.disconnect();
      setWallet(null);
      setPublicKey(null);
      alert("Wallet disconnected!");
    }
  };

  // Execute a program transition
  const executeTransition = async (functionName, inputs) => {
    if (!wallet) {
      alert("Please connect a wallet first!");
      return null;
    }
    setLoading(true);
    try {
      const txId = await wallet.execute({
        programId: PROGRAM_ID,
        functionName,
        inputs,
        fee: 1000000, // 1 credit in microcredits (adjust as needed)
      });
      console.log(`${functionName} Transaction ID:`, txId);
      return txId;
    } catch (e) {
      console.error(`${functionName} failed:`, e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Handle staking on an event
  const handleStake = async () => {
    if (!eventId || !stakeAmount) {
      alert("Fill all fields!");
      return;
    }
    try {
      const inputs = [
        `${eventId}field`,
        `${stakeAmount}u64`,
        prediction.toString(),
      ];
      const txId = await executeTransition("stake_public", inputs);
      if (txId) alert(`Stake placed! Tx ID: ${txId}`);
    } catch (e) {
      alert("Staking failed: " + e.message);
    }
  };

  // Handle claiming winnings
  const handleClaim = async () => {
    if (!eventId || !claimAmount) {
      alert("Fill all fields!");
      return;
    }
    try {
      const inputs = [`${eventId}field`, `${claimAmount}u64`];
      const txId = await executeTransition("claim_public", inputs);
      if (txId) alert(`Winnings claimed! Tx ID: ${txId}`);
    } catch (e) {
      alert("Claim failed: " + e.message);
    }
  };

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                ZK Prediction Market
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                A zero-knowledge prediction market on the Aleo blockchain where
                users stake credits on event outcomes, with payouts determined
                by a stake-weighted voting system that decays over time for
                fairness and privacy.
              </p>
            </div>

            {publicKey && (
              <div className="flex items-center justify-center mb-8 bg-slate-800/50 py-3 px-6 rounded-full backdrop-blur-sm border border-slate-700">
                <Wallet className="w-5 h-5 mr-2 text-emerald-400" />
                <p className="text-emerald-400 font-medium">
                  Connected: {publicKey.slice(0, 10)}...{publicKey.slice(-6)}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Stake Section */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-purple-500/10 transition-all">
                <div className="flex items-center mb-6">
                  <ChartBar className="w-6 h-6 mr-3 text-purple-400" />
                  <h3 className="text-xl font-bold">Stake on an Event</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Event ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 123"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Stake Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Amount in credits"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Your Prediction
                    </label>
                    <select
                      value={prediction}
                      onChange={(e) => setPrediction(e.target.value === "true")}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <button
                    onClick={handleStake}
                    disabled={loading || !wallet}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      loading || !wallet
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/30"
                    }`}
                  >
                    {loading ? "Processing..." : "Place Stake"}
                  </button>
                </div>
              </div>

              {/* Claim Section */}
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-emerald-500/10 transition-all">
                <div className="flex items-center mb-6">
                  <Coins className="w-6 h-6 mr-3 text-emerald-400" />
                  <h3 className="text-xl font-bold">Claim Winnings</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Event ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 123"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Claim Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Amount in credits"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="pt-8">
                    <button
                      onClick={handleClaim}
                      disabled={loading || !wallet}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                        loading || !wallet
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-500/30"
                      }`}
                    >
                      {loading ? "Processing..." : "Claim Winnings"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="py-6 text-center text-slate-500 text-sm">
          <p>© 2025 ZK Prediction Market on Aleo • Privacy-First Predictions</p>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
