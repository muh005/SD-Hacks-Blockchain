var Question = artifacts.require("./Question.sol");

module.exports = function(deployer) {
  deployer.deploy(Question, "3#33", 3, 23, 24323, 12);
};
