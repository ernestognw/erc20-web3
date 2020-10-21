const Web3 = require('web3');
const { abi, networks } = require('../build/contracts/BlockdemyCoin.json');

window.onload = function () {
  //Variables
  let web3;
  let from;
  let BDMContract;

  // Elements
  const connectButton = document.getElementById('connect');
  const content = document.getElementById('content');
  const account = document.getElementById('account');
  const balance = document.getElementById('balance');
  const balanceERC20 = document.getElementById('balanceERC20');

  // Form
  const form = document.getElementById('send');
  const recipientInput = document.getElementById('recipient');
  const amountInput = document.getElementById('amount');

  // Form ERC20
  const formERC20 = document.getElementById('sendERC20');
  const recipientERC20Input = document.getElementById('recipientERC20');
  const amountERC20Input = document.getElementById('amountERC20');

  // Functions
  async function connect() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        web3 = new Web3(window.ethereum);

        const networkId = await web3.eth.net.getId();

        BDMContract = new web3.eth.Contract(abi, networks[networkId].address);

        let accounts = await web3.eth.getAccounts();

        from = accounts[0];

        const balanceETH = await web3.eth.getBalance(from);
        const balanceBDM = await BDMContract.methods.balanceOf(from).call();

        balance.innerText = balanceETH;
        balanceERC20.innerText = balanceBDM;

        content.style.display = 'initial';
        connectButton.style.display = 'none';
        account.innerText = from;
      } catch (err) {
        console.log(err);
        alert('Has rechazado la conexión');
      }
    } else {
      alert('Necesitas un proveedor de web3');
    }
  }

  async function transact(event) {
    event.preventDefault();

    const amount = amountInput.value;
    const recipient = recipientInput.value;

    if (Number(amount <= 0)) {
      alert('Valor no permitido');
      return;
    }

    if (!web3.utils.isAddress(recipient)) {
      alert('Dirección inválida');
      return;
    }

    web3.eth.sendTransaction({
      from,
      to: recipient,
      value: amount,
    });
  }

  async function transactERC20(event) {
    event.preventDefault();

    const amount = amountERC20Input.value;
    const recipient = recipientERC20Input.value;

    if (Number(amount <= 0)) {
      alert('Valor no permitido');
      return;
    }

    if (!web3.utils.isAddress(recipient)) {
      alert('Dirección inválida');
      return;
    }

    BDMContract.methods.transfer(recipient, amount).send({
      from,
    });
  }

  // Listeners
  connectButton.onclick = connect;
  form.onsubmit = transact;
  formERC20.onsubmit = transactERC20;
};
