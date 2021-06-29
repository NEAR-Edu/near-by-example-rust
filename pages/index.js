import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect, keyStores, WalletConnection } from "near-api-js";
import Image from "next/image";
import Loading from "../components/loading/Loading";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const [wallet, setWallet] = useState();

  useEffect(() => {
    (async () => {
      const near = await connect({
        nodeUrl: "https://rpc.testnet.near.org",
        networkId: "testnet",
        walletUrl: "https://wallet.testnet.near.org",
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      });
      setWallet(new WalletConnection(near, "near-by-example-rust"));
    })();
  }, []);

  if (!wallet) return <Loading />;
  if (wallet.isSignedIn()) {
    router.push("/exercises");
    return <Loading />;
  }

  const handleSignin = async () => {
    wallet.requestSignIn({
      contractId: process.env.NEXT_PUBLIC_CONTRACT_ID,
    });
  };

  return (
    <section className={styles.Home}>
      <Image
        src="https://avatars.githubusercontent.com/u/85355517"
        alt="Logo"
        width="auto"
        height="100%"
      />
      <section>
        <p>
          Learn to write{" "}
          <span className={styles.bold}>Rust Smart Contracts on NEAR</span> by
          following interactive coding examples.
        </p>

        <p>Get started by logging in with your NEAR testnet wallet</p>

        <button onClick={handleSignin}>Signin with NEAR</button>
      </section>
    </section>
  );
}
