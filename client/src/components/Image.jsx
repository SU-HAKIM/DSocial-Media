import React from "react";
const baseUrl = "https://ipfs.infura.io/ipfs/";

const Image = ({ image, contract, accounts, web3 }) => {
  return (
    <div className="card mb-2">
      <div className="card-header">Author : {image.author}</div>
      <div className="card-body">
        <img
          src={`${baseUrl}${image._hash}`}
          alt="post pic"
          style={{ height: 300, marginBottom: 5 }}
        />
        <p>{image.description}</p>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center p-2">
        <p className="text-muted">
          TIPS:{image.tipAmount / "1000000000000000000"} ETH
        </p>
        {image.author !== accounts && (
          <button
            className="btn text-primary"
            style={{ cursor: "pointer" }}
            onClick={async () => {
              let wei = await web3.utils.toWei("0.1", "Ether");
              await contract.methods
                .tipImageOwner(image.id)
                .send({ from: accounts, value: wei });
            }}
          >
            TIPS:0.1 ETH
          </button>
        )}
      </div>
    </div>
  );
};

export default Image;
