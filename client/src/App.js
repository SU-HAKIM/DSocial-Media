import React, { useEffect, useState } from "react";
import getContract from "./getWeb3";
import Web3 from 'web3';
import "./App.css";
import Decentragram from "./contracts/Decentragram.json";
import Navbar from "./components/Navbar";
import Form from "./components/Form";
import Image from "./components/Image";

import ipfs from "./ipfs";


const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractsAddress, setContractAddress] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([]);
  const [imagesCount, setImagesCount] = useState(null);
  const [buffer, setBuffer] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let connect = async () => {

      await connectToMetaMask();
    }
    connect();
  }, [done])

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
      ipfs.files.add(buffer, async (error, result) => {
        if (error) {
          console.log(error);
          return
        }
        await contract.methods.uploadImage(result[0].hash, description).send({ from: accounts });
        setDone(true);
      })

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
        //fetch image
        for (let i = 1; i <= imagesCount; i++) {
          const image = await contract.contract.methods.images(i).call();
          setImages(prev => ([...prev, image]));
        }
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
  console.log(images)
  return (
    <>
      <Navbar address={accounts} />
      <Form
        description={description}
        handleChange={handleChange}
        createImage={createImage}
        handleFileChange={handleFileChange}
      />
      <div className="container w-50 mx-auto mt-2">
        {
          images.length && images.map((image, index) => {
            if (image._hash) {
              return <Image image={image} key={index} contract={contract} accounts={accounts} web3={web3} />
            } else {
              return <div></div>
            }
          })
        }
      </div>
    </>
  );
}


export default App;

