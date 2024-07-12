/** @format */
"use client";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import shopifireContract from "../../../blockchain/shopifire";
import { AbiItem } from "web3-utils";
import Image from "next/image";
import Flower from "../../assets/flower.jpg";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ShopPage = () => {
  const [error, setError] = useState<string>("");
  const [inventory, setInventory] = useState<number | undefined>(undefined);
  const [myProductCount, setMyProductCount] = useState<number>(0);
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
      <header className="bg-primary px-6 py-4 text-primary-foreground">
        <div className="flex justify-between items-center container">
          <a href="#" className="font-bold text-2xl">
            ShopApp
          </a>
          <button
            onClick={connectWallet}
            className="bg-indigo-700 m-2 p-2 text-white"
          >
            {address ? "Connected" : "Connect Wallet"}
          </button>
        </div>
      </header>
      <div className="font-bold text-[#FF5B5B] text-lg">
        <p>{error}</p>
      </div>
      <section className="">
        <div className="container">
          <div className="flex flex-col justify-center items-center space-y-4 text-center">
            <h2 className="font-bold text-3xl sm:text-4xl tracking-tighter">
              Featured Products
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Check out our curated selection of the best products for your
              needs.
            </p>
          </div>
          <div className="flex justify-center">
            <div>
              <div className="flex justify-center">
                <h3 className="font-medium text-indigo-300 text-lg">
                  {myProductCount !== undefined && myProductCount > 0 ? (
                    <span>You&lsquo;ve added {myProductCount}!</span>
                  ) : (
                    <span>You haven&lsquo;t made a purchase yet :(</span>
                  )}
                </h3>
              </div>
              <div className="flex flex-col justify-center items-center gap-2 m-3 p-3 border rounded-lg">
                <Image
                  src={Flower}
                  width={200}
                  height={200}
                  alt="Product Image"
                  className="rounded-md aspect-square object-cover"
                />
                <div className="text-center">
                  <h3 className="font-medium text-lg">Product: Flower</h3>
                  <h3 className="font-medium text-md">
                    Available Balance:{" "}
                    {inventory !== undefined ? (
                      <span>{inventory}</span>
                    ) : (
                      <span>Connect wallet to view</span>
                    )}
                  </h3>
                </div>
                <form onSubmit={buyProductHandler} className="grid text-black">
                  <input
                    className="text-black"
                    placeholder="Quantity"
                    type="number"
                    value={buyProductQuantity}
                    onChange={handleInputChange}
                  />
                  <button
                    type="submit"
                    className="bg-indigo-700 m-2 p-2 rounded-lg text-white"
                  >
                    Buy $1/each
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
