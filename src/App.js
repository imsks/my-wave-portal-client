import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import WavePortal from "./utils/WavePortal.json";

export default function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [waveCount, setWaveCount] = useState(0);
    const [miningStatus, setMiningStatus] = useState(null);

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask installed and logged in");
            return;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const [account] = accounts;

            setCurrentAccount(account);

            const contractAddress =
                "0xF0849c244CF1737c57A3155d7DfEc50F13398aF5";

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalAddress = new ethers.Contract(
                contractAddress,
                WavePortal.abi,
                signer
            );

            let count = await wavePortalAddress.getTotalWaves();
            setWaveCount(count.toNumber());
        } else {
            console.log("No accounts found");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            const [account] = accounts;

            setCurrentAccount(account);
        } catch (error) {
            console.log(error);
        }
    };

    const wave = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            setMiningStatus("Waving...");

            const contractAddress =
                "0xF0849c244CF1737c57A3155d7DfEc50F13398aF5";

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalAddress = new ethers.Contract(
                contractAddress,
                WavePortal.abi,
                signer
            );

            const waveTxn = await wavePortalAddress.wave();
            await waveTxn.wait();

            const count = await wavePortalAddress.getTotalWaves();
            setMiningStatus("Hi, You just waved at me. Thanks!");
            setWaveCount(count.toNumber());
        } catch (error) {
            console.log(error);
        }
    };

    const connectWalletButton = !currentAccount && (
        <button className="waveButton" onClick={connectWallet}>
            Connect wallet
        </button>
    );

    return (
        <div className="body">
            <div className="dataContainer">
                <div className="header">
                    <span role="img" aria-label="wave">
                        👋
                    </span>{" "}
                    Hey there!
                </div>

                <div className="bio">
                    I'm Sachin, a full stack engineer. Connect your Ethereum
                    wallet and wave at me!
                </div>

                <button className="waveButton" onClick={wave}>
                    Wave at Me
                </button>
                {connectWalletButton}
                <h4 className="text">Total wave count: {waveCount}</h4>
                <h4 className="text">{miningStatus}</h4>
            </div>
        </div>
    );
}
