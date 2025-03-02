import ConnectWalletButton from "./ConnectWallet";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-16 py-2">
      <div>
        <h1 className="text-xl font-bold">AleoPredict</h1>
      </div>
      <ConnectWalletButton />
    </div>
  );
};

export default Header;
