import { connect, keyStores, WalletConnection } from "near-api-js";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const useWallet = () => {
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const near = await connect({
        networkId: "testnet",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
      });
      setWallet(new WalletConnection(near, "near-by-example-rust"));
      setLoading(false);
    })();
  }, []);

  return [loading, wallet];
};

export const useExercises = () => {
  const [loading, wallet] = useWallet();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (loading) return;

    (async () => {
      const results = await wallet
        .account()
        .viewFunction(process.env.NEXT_PUBLIC_CONTRACT_ID, "get_status", {
          account_id: wallet.getAccountId(),
        });

      setExercises(results.map(([title, status]) => ({ title, status })));
    })();
  }, [loading]);

  return exercises;
};

export const useSetExerciseStatus = (id) => {
  const router = useRouter();
  const [loading, wallet] = useWallet();
  const exercises = useExercises();

  const setExerciseStatus = useCallback(
    (success) => {
      if (loading) return;
      const index = Number(id);
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const callbackUrl =
        index < exercises.length - 1
          ? `${baseUrl}/exercises/${index + 1}`
          : `${baseUrl}/exercises`;
      wallet.account().functionCall({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_ID,
        methodName: "set_status",
        args: {
          account_id: wallet.getAccountId(),
          exercise_index: index,
          success,
        },
        walletCallbackUrl: callbackUrl,
      });
    },
    [id, loading, exercises]
  );

  return setExerciseStatus;
};
