const express = require('express');
const app = express();

const web3Host = 'https://mainnet.infura.io/';
const iterface = require('./utils/iterface');
const TRUEContractAddr = '0xa4d17ab1ee0efdd23edc2869e7ba96b89eecf9ab';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(web3Host));

const getBalance = (address, cb) => {
	web3.eth.getBalance(address).then(async (balance) => {
		cb(web3.utils.fromWei(balance, 'ether'));
	});
};

app.get('/getBalance', (req, res) => {
	const { address } = req.query;

	if (!address) {
		res.send({
			status: 0,
			msg: '参数不全',
			data: null
		});
		return;
	}

	const myContract = new web3.eth.Contract(iterface, TRUEContractAddr);
	myContract.methods.balanceOf(address).call().then(function(x) {
		let true_balance = web3.utils.fromWei(x, 'ether');

		getBalance(address, (eth_balance) => {
			res.send({
				status: 200,
				data: {
					address: address,
					symbol: 'ETH',
					eth_balance: eth_balance,
					true_balance: true_balance
				}
			});
		});
	});
});

app.listen('3000', () => {
	console.log('Port 3000......');
});
