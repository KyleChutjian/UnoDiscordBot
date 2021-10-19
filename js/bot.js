console.clear();

const Client = require('./Structures/Client.js')
const config = require('./Data/config.json');
const Game = require('./Structures/Game.js');
const client = new Client();
// const game = new Game();

client.start(config.token);


// const {Worker, workerData} = require('worker_threads');
// const game = (workerData) => {
//     return new Promise((resolve,reject) => {
//         const worker = new Worker('./Structures/Game.js', { workerData });
//         worker.on('message', resolve);
//         worker.on('error', reject);
//         worker.on('exit', (code) => {
//             if (code !== 0) reject(new Error(`stopped with ${code} exit code`));
//         })



//     })
// }
// const run = async () => {
//     const result = await game('test')
//     console.log(result);
// }
// run().catch(err => console.log(err));