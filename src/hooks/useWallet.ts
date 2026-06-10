import { useState, useEffect, useCallback } from 'react';
import {
  connectWallet,
  getConnectedWallet,
  formatAddress,
  onAccountChange,
  onChainChange,
  RITUAL_CHAIN,
} from '../lib/wallet';

interface WalletState {
  address: string | null;
  formattedAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: string | null;
  isCorrectChain: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => void;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    getConnectedWallet().then(addr => { if (addr) setAddress(addr); });
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' }).then(setChainId);
    }
    onAccountChange((accounts) => {
      setAddress(accounts.length > 0 ? accounts[0] : null);
    });
    onChainChange((id) => { setChainId(id); });
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    setIsConnecting(true);
    const addr = await connectWallet();
    if (addr) setAddress(addr);
    setIsConnecting(false);
    return addr;
  }, []);

  const disconnect = useCallback(() => { setAddress(null); }, []);

  const isCorrectChain = chainId?.toLowerCase() === RITUAL_CHAIN.chainId.toLowerCase();

  return {
    address,
    formattedAddress: address ? formatAddress(address) : null,
    isConnecting,
    isConnected: !!address,
    chainId,
    isCorrectChain,
    connect,
    disconnect,
  };
}
