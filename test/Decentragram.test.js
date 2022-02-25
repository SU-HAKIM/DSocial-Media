const Decentragram = artifacts.require("../contracts/Decentragram.sol");

contract("Decentragram", ([deployer, author, tipper]) => {
    let decentragram;
    before(async () => {
        decentragram = await Decentragram.deployed();
    })

    describe("deployment", async () => {
        it("deployed successfully", async () => {
            const address = await decentragram.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it("has a name", async () => {
            const name = await decentragram.name();
            assert.equal(name, "Decentragram");
        })
    })

    describe("images", async () => {
        let result;
        const hash = "abc";
        let image_id = 1;
        before(async () => {
            result = await decentragram.uploadImage(hash, "Image Description", { from: author })
            image_id = await decentragram.image_id();
        })

        it("creates images", async () => {
            assert.equal(image_id.toNumber(), 2);
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), 1, "id is correct");
            assert.equal(event._hash, hash, "Hash is correct");
            assert.equal(event.description, "Image Description", "has a description");
            assert.equal(event.tipAmount.toNumber(), 0, "got a tip");
            assert.equal(event.author, author, "id is correct");

            decentragram.uploadImage('', "image description", { from: author }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return decentragram.uploadImage('abc', "", { from: author })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return decentragram.uploadImage('abc', "id", { from: '0x0' })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
            })

        })

        it("lists images", async () => {
            const image = await decentragram.images(1);


            assert.equal(image.id.toNumber(), 1, "id is correct");
            assert.equal(image._hash, "abc", "Hash is correct");
            assert.equal(image.description, "Image Description", "has a description");
            assert.equal(image.tipAmount.toNumber(), 0, "got a tip");
            assert.equal(image.author, author, "author");
        })

        it("allows user to tip a image", async () => {
            decentragram.tipImageOwner(99, { from: tipper, value: 10 }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
            })

            let oldAuthorBalance = await web3.eth.getBalance(author);

            let result = await decentragram.tipImageOwner(1, { from: tipper, value: 1000000 });
            let event = result.logs[0].args;

            assert.equal(event.id.toNumber(), 1, "id is correct");
            assert.equal(event._hash, "abc", "Hash is correct");
            assert.equal(event.description, "Image Description", "has a description");
            assert.equal(event.tipAmount.toNumber(), 1000000, "got a tip");
            assert.equal(event.author, author, "author")

            let newAuthorBalance = await web3.eth.getBalance(author);

            assert.equal(newAuthorBalance.toNumber(), oldAuthorBalance.toNumber() + 1000000);


        })
    })
})








