const Decentragram = artifacts.require("../contracts/Decentragram.sol");

contract("Decentragram", accounts => {
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
})