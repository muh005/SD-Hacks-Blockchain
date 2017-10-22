var QuestionList = artifacts.require("./QuestionList.sol");

module.exports = function(deployer) {
  deployer.deploy(QuestionList);
};
