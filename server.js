import net from 'net';
import chalk from 'chalk';
import readline from 'readline';
import utils from './utils.js';
import setting from './setting.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let users = [];

const server = net.createServer((client)=>{
    client.setEncoding('utf8');

    client.on('data', (data)=>{
        let d = JSON.parse(data);
        const curTime = utils.getCurrentTime();
        const curUsers = utils.getCurrentUserList(users);

        switch(d.status){
            case 100:
                if(curUsers.includes(d.body)){
                    client.write(JSON.stringify({status: 110, body: '중복된 아이디입니다. 다시 시도하세요.'}));
                    return;
                }
                if(String(d.body).startsWith('/') || String(d.body).includes(' ')){
                    client.write(JSON.stringify({status: 111, body: '사용할 수 없는 아이디입니다. 다시 시도하세요.'}));
                    return;
                }
                
                client.name = d.body;
                users.push(client);
                console.log(chalk.yellow(`현재 인원 : ${utils.getCurrentUserCount(users)}명`));
                console.log(chalk.blue(`[${curTime}] ${client.name}님이 접속했어요.(IP 주소 : ${client.remoteAddress})`));
                for(let user of users) user.write(JSON.stringify({status: 101, body: `${client.name}님이 들어왔습니다.`}));
            break;
            case 200:
                console.log(chalk.green(`[${curTime}] ${d.body}`));
                for(let user of users){
                    if(client.name === user.name) continue; // 본인에게는 전송하지 않음
                    user.write(JSON.stringify({status: 201, body: `${d.body}`}));
                }
            break;
            case 210:
                const result = utils.getUsers(users);
                client.write(JSON.stringify({status: 211, body: `${result}`}));
            break;
            case 220:
                const index = curUsers.indexOf(d.to);
                if(index === -1){
                    client.write(JSON.stringify({status: 222, body: '전송할 ID가 없습니다.'})); // 실패 알림
                    return;
                }

                // 해당 유저가 있으면 dm 전송
                const selectedUser = users[index];
                if(client.name === selectedUser.name){ // 단, 본인에게는 전송하지 못함.
                    selectedUser.write(JSON.stringify({status: 222, body: '본인에게는 DM을 보낼 수 없습니다.'}));
                    break;
                }
                
                selectedUser.write(JSON.stringify({status: 221, body: `DM) ${client.name} : ${d.body}`})); // 메세지 전송
                console.log(chalk.magenta(`[${curTime}] ${client.name} 유저가 ${selectedUser.name} 유저에게 DM을 보냈어요 -> ${d.body}`));
                client.write(JSON.stringify({status: 221, body: 'DM 전송에 성공했습니다.'})); // 성공 알림
            break;
        }
    });

    client.on('close', ()=>{
        if(client.name === undefined) return;

        const curTime = utils.getCurrentTime();
        const index = users.indexOf(client);
        users.splice(index, 1);
        
        console.log(chalk.yellow(`현재 인원 : ${utils.getCurrentUserCount(users)}명`));
        console.log(chalk.blue(`[${curTime}] ${client.name}님이 퇴장했어요.`));
        for(let user of users) user.write(JSON.stringify({status: 150, body: `${client.name}`}));
    });
});

server.listen(setting.PORT, '0.0.0.0', ()=>{
    console.clear();
    console.log(chalk.blue(`[${utils.getCurrentTime(users)}] Port ${setting.PORT}에서 서버가 열렸습니다.\n`));

    rl.on('line', (line)=>{
        if(line === '') return;

        if(line.startsWith('/')){
            if(line === '/users'){
                console.log(chalk.yellow(`현재 인원 : ${utils.getCurrentUserCount(users)}명`));
                if(users.length !== 0) console.log(chalk.blue(utils.getCurrentUserList(users)));
            }
            else if(line.startsWith('/w ')){
                const cmd = line.split(' ');

                const toUser = cmd[1];
                if(toUser === '') return;
                
                const text = cmd.slice(2).join(' ');
                if(text === '') return;

                const curUsers = utils.getCurrentUserList(users);
                const index = curUsers.indexOf(toUser);
                if(index === -1){
                    console.log(chalk.red('해당 유저가 없습니다.'));
                    return;
                }

                const selectedUser = users[index];
                selectedUser.write(JSON.stringify({status: 225, body: `${text}`}));
                console.log(chalk.magenta('DM 전송에 성공했습니다.'));
            }
        }
        else for(let user of users) user.write(JSON.stringify({status: 250, body: `[Notice] ${line}`}));
    });

    server.on('error', (err)=>{
        console.log(chalk.red(`[${utils.getCurrentTime()}] 서버에 오류가 발생했습니다.`));
    });

    server.on('close', ()=>{
        console.log(chalk.blue(`[${utils.getCurrentTime()}] 서버를 닫습니다.`));
    });
});
