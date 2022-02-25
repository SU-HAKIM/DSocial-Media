// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;


contract Decentragram{
    string public name="Decentragram";
    struct Image{
        uint id;
        string _hash;
        string description;
        uint tipAmount;
        address payable author;
    }
    uint public image_id=1;

    //TODO:Store Posts
    mapping(uint=>Image) public images;
    event ImageCreated(
        uint id,
        string _hash,
        string description,
        uint tipAmount,
        address payable author
    );
    event ImageTipped(
        uint id,
        string _hash,
        string description,
        uint tipAmount,
        address payable author
    );

    //TODO:Create Image
    function uploadImage(string memory _hash,string memory _description) public{
        require(bytes(_hash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        images[image_id]=Image(image_id,_hash,_description,0,payable(msg.sender));
        emit ImageCreated(image_id, _hash, _description, 0, payable(msg.sender));
        image_id++; 
        
    }

    function tipImageOwner(uint _id) public payable{
        require(_id > 0 && _id <= image_id);
        Image memory _image=images[_id];
        address payable _author=_image.author;
        _author.transfer(msg.value);
        _image.tipAmount+=msg.value;
        images[_id]=_image;

        emit ImageCreated(_id, _image._hash, _image.description, _image.tipAmount, _author);
    }
}