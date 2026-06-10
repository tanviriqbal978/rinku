export const RITUAL_CHAIN = {
  chainId: '0x7BB',
  chainName: 'Ritual Testnet',
  nativeCurrency: { name: 'RITUAL', symbol: 'RITUAL', decimals: 18 },
  rpcUrls: ['https://rpc.ritualfoundation.org'],
  blockExplorerUrls: ['https://explorer.ritualfoundation.org'],
};

declare global {
  interface Window { ethereum?: any; }
}

export function isMetaMaskInstalled(): boolean {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

export async function connectWallet(): Promise<string | null> {
  if (!isMetaMaskInstalled()) {
    window.open('https://metamask.io/download/', '_blank');
    return null;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) return null;
    await switchToRitualNetwork();
    return accounts[0] as string;
  } catch (err: any) {
    console.error('Wallet connect error:', err);
    return null;
  }
}

export async function switchToRitualNetwork(): Promise<void> {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: RITUAL_CHAIN.chainId }],
    });
  } catch (err: any) {
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [RITUAL_CHAIN],
      });
    } else {
      throw err;
    }
  }
}

export async function getConnectedWallet(): Promise<string | null> {
  if (!isMetaMaskInstalled()) return null;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch { return null; }
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function onAccountChange(callback: (accounts: string[]) => void): void {
  if (window.ethereum) window.ethereum.on('accountsChanged', callback);
}

export function onChainChange(callback: (chainId: string) => void): void {
  if (window.ethereum) window.ethereum.on('chainChanged', callback);
}
