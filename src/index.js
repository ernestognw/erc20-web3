const Web3 = require('web3');

window.onload = function () {
  //Variables
  let web3;
  let from;

  // Elements
  const connectButton = document.getElementById('connect');
  const content = document.getElementById('content');
  const account = document.getElementById('account');

  // Form
  const form = document.getElementById('send');
  const recipientInput = document.getElementById('recipient');
  const amountInput = document.getElementById('amount');

  // Functions
  async function connect() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        web3 = new Web3(window.ethereum);

        let accounts = await web3.eth.getAccounts();

        from = accounts[0];

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

  // Listeners
  connectButton.onclick = connect;
  form.onsubmit = transact;
};
