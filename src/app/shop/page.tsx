/** @format */
"use client";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import shopifireContract from "../../../blockchain/shopifire";
import { AbiItem } from "web3-utils";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ShopPage = () => {
  const [error, setError] = useState<string>("");
  const [inventory, setInventory] = useState<number | undefined>(undefined);
  const [myProductCount, setMyProductCount] = useState<number | undefined>(0);
  const [buyProductQuantity, setBuyProductQuantity] = useState<number>(1);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [sc, setShopifireContract] = useState<any>(null);

  const getMyProductCountHandler = async () => {
    try {
      const myProductCount = await sc.methods.productBalances(address).call();
      setMyProductCount(parseInt(myProductCount, 10));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to Connect Wallet");
      }
    }
  };

  const getInventory = async () => {
    try {
      const inventory = await sc.methods.getProductBalance().call();
      setInventory(parseInt(inventory, 10));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to Connect Wallet");
      }
    }
  };

  useEffect(() => {
    if (sc) getInventory();
    if (sc && address) getMyProductCountHandler();
  }, [sc, address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyProductQuantity(parseInt(e.target.value, 10));
  };

  const buyProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3 || !address) {
      setError("Web3 or address not initialized");
      return;
    }
    try {
      const cost = web3.utils.toWei(
        (buyProductQuantity * 0.5).toString(),
        "ether"
      );
      await sc.methods.purchase(buyProductQuantity).send({
        from: address,
        value: cost,
      });
      setError("Purchase successful!");
      getInventory();
      getMyProductCountHandler();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to Purchase Product");
      }
    }
  };

  const connectWallet = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAddress(accounts[0]);

        const scInstance = shopifireContract(web3Instance);
        setShopifireContract(scInstance);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to Connect Wallet");
        }
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div>
      <h1 className="p-4 font-bold text-2xl">Shop Page</h1>
      <div>
        <button
          onClick={connectWallet}
          className="bg-indigo-700 m-2 p-2 text-white"
        >
          Connect Wallet
        </button>
      </div>
      <section>{error}</section>

      <section>
        <h2>Product inventory: {inventory}</h2>
      </section>
      <section>
        <h2>My Product: {myProductCount}</h2>
      </section>
      <section>
        <h2>Buy Products</h2>
        <form onSubmit={buyProductHandler} className="text-black">
          <input
            className="text-black"
            placeholder="Quantity"
            type="number"
            value={buyProductQuantity}
            onChange={handleInputChange}
          />
          <button type="submit" className="bg-indigo-700 m-2 p-2 text-white">
            Buy
          </button>
        </form>
      </section>
    </div>
  );
};

export default ShopPage;
