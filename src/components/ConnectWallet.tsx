import { useAccount, useConnect, useDisconnect, useSelect } from "aleo-hooks";
import { useState } from "react";
import WalletModal from "../WalletModal";

const ConnectWalletButton = () => {
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { select } = useSelect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWalletSelect = (walletId: WalletAdapterId) => {
    const walletAdapterMap = {
      "leo-wallet": "Leo Wallet",
      "puzzle-wallet": "Puzzle Wallet",
      "fox-wallet": "Fox Wallet",
      "soter-wallet": "Soter Wallet",
    };

    const adapterId = walletAdapterMap[walletId];

    if (!adapterId) {
      console.error(`Invalid wallet id:${walletId}`);
      return;
    }
    select(adapterId);
    setIsModalOpen(false);

    setTimeout(() => {
      connect(adapterId);
    }, 100);
  };

  const handleClick = () => {
    if (account.connected) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {account.connected ? (
        <div className="flex gap-2">
          <div className="w-60  text-white bg-gray-900 text-[14px] overflow-hidden px-4 py-2 rounded-md text-ellipsis">
            {account.publicKey}...
          </div>
          <button
            className="bg-red-500 px-4 py-1 text-white rounded-md hover:bg-red-600"
            onClick={handleClick}
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button
          className="bg-gray-800 px-4 py-1 text-white rounded-md hover:bg-gray-600"
          onClick={handleClick}
        >
          Connect Wallet
        </button>
      )}

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleWalletSelect}
      />
    </>
  );
};

export default ConnectWalletButton;
