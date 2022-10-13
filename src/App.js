import { useState } from 'react';
import { ethers } from 'ethers';
import ABI from './abi.json';

import './App.css';

function App() {
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const CONTRACT_ADDRES = "0xE9956c971B72aD74F249E616828df613F03E858b";

  async function getProvider() {
    /* validar se usuário possue uma carteira no navegador */
    if (!window.ethereum) return setMessage("No Wallet found!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.send("eth_requestAccounts", []);
    /* se o usuario se conectou */
    if (!accounts || !accounts.length) return setMessage("Wallet not authorized.");

    return provider;
  }

  async function getContractSigner() {
    const provider = await getProvider();
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRES,
      ABI,
      provider
    );

    return contract.connect(signer);
  }

  async function doSearch() {
    try {
      const provider = await getProvider();

      const contract = new ethers.Contract(
        CONTRACT_ADDRES,
        ABI,
        provider
      );
      const customer = await contract.getCustomer(customerId);

      setMessage(JSON.stringify(customer));
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function doSave() {
    try {
      const contract = await getContractSigner();

      const tx = await contract.addCustomer({ name, age });
      setMessage(JSON.stringify(tx));
    } catch (err) {
      setMessage(err.message);
    }
  }

  function onSearchClick() {
    setMessage("");
    doSearch();
  }

  function onSaveClick() {
    setMessage("");
    doSave();
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <label>
            Customer ID:
            <input
              type="number"
              value={customerId}
              onChange={(evt) => setCustomerId(evt.target.value)}
            />
          </label>
          <input
            type="button"
            value="Search"
            onClick={onSearchClick}
          />
        </p>

        <hr />

        <p>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
            />
          </label><br />
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(evt) => setAge(evt.target.value)}
            />
          </label>
          &nbsp;&nbsp; <input
            type="button"
            value="Save"
            onClick={onSaveClick}
          />
        </p>

        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
