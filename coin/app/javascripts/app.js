// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import question_artifacts from '../../build/contracts/QuestionList.json'

// QuestionList is our usable abstraction, which we'll use through the code below.
var QuestionList = contract(question_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the QuestionList abstraction for Use.
    QuestionList.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });
  },

  createQuestion: function() {
    var self = this;
    var ipfs = document.getElementById("ipfs").value;
    var maxround = parseInt(document.getElementById("maxround").value);
    var duration = parseInt(document.getElementById("duration").value);
    var bond = parseInt(document.getElementById("bond").value);
    var reward = parseInt(document.getElementById("reward").value);

    var questList;
    QuestionList.deployed().then(function(instance) {
      questList = instance;
      return questList.createQuestion.sendTransaction("QmfMGfnki34CWW3hthFv9osHnAusyYmGNfki4zcTmwXbnc", 1, 1, 1, 1, {from: "0x94cce90457ec9fcc91e13c31aac7a3e0a6d1979c"});
    }).then(function(value) {
      console.log(value);
    }).catch(function(e) {
      console.log(e);
      console.log("Error creating question; see log.");
    });
  },

  displayQuestion: function() {
    var self = this;

    var questList;
    QuestionList.deployed().then(function(instance) {
      questList = instance;
      return questList.displayQuestion.call();
    }).then(function(value) {
      console.log(value);
      for (var entry of value) {
        console.log(entry);
        document.getElementById("questions").value += entry+"\n";
      }
    }).catch(function(e) {
      console.log(e);
      console.log("Error displaying questions; see log.");
    });
  },

  getQuestion: function() {
    var self = this;

    var questList;
    QuestionList.deployed().then(function(instance) {
      questList = instance;
      return questList.getQuestion.call("123");
    }).then(function(value) {
      console.log(value);
      for (var entry of value) {
        console.log(entry);
        document.getElementById("questions").value += entry+"\n";
      }
    }).catch(function(e) {
      console.log(e);
      console.log("Error displaying questions; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 Question, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
