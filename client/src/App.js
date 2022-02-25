import React, { useEffect, useState } from "react";
import getContract from "./getWeb3";
import Web3 from 'web3';
import "./App.css";

import Decentragram from "./contracts/Decentragram.json";
import Navbar from "./components/Navbar";
import Form from "./components/Form";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractsAddress, setContractAddress] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([]);
  const [imagesCount, setImagesCount] = useState(null);
  const [buffer, setBuffer] = useState(null);

  useEffect(() => {
    let connect = async () => {

      await connectToMetaMask();
    }
    connect();
  }, [])

  const handleChange = (e) => {
    setDescription(e.target.value);
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    }
  }

  const createImage = async () => {
    try {
      console.log(description, buffer);
    } catch (error) {
      console.log(error)
    }
  }


  const connectToMetaMask = async () => {
    if (typeof window !== undefined && typeof window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3 = new Web3(window.ethereum);
        let accounts = await web3.eth.getAccounts();
        const contract = await getContract(web3, Decentragram);
        const imagesCount = await contract.contract.methods.image_id().call();
        //set all data
        setImagesCount(imagesCount);
        setWeb3(web3);
        setContract(contract.contract);
        setAccounts(accounts[0]);
        setContractAddress(contract.address);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Please install Meta Mask")
    }
  }
  console.log(contractsAddress);
  return (
    <>
      <Navbar address={accounts} />
      <Form
        description={description}
        handleChange={handleChange}
        createImage={createImage}
        handleFileChange={handleFileChange}
      />
    </>
  );
}


export default App;

