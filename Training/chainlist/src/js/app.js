App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set provider to the testRPC.

    if (typeof web3 !== 'undefined') {
      // Mist or Metamask exists, instantiate object that we retrieve
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Otherwise local
      App.web3Provider = new
      Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#account").text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if (err === null) {
            $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH");
          }
        });
      }
    });
  },

  initContract: function() {
    // Retrieve meta data and initialize new truffle contract
    // Uses browser sync to find json file in bs-config.json
    $.getJSON('ChainList.json', function(chainListArtifact) { 
      // Necessary contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.ChainList = TruffleContract(chainListArtifact);
      // Set the provider for our contract
      App.contracts.ChainList.setProvider(App.web3Provider);
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
