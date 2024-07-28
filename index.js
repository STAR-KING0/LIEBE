const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || 3000; // Default port is 3000 if not specified

function start() {
    let args = [path.join(__dirname, 'main.js'), ...process.argv.slice(2), `--port=${port}`];
    console.log([process.argv[0], ...args].join('\n'));

    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    p.on('message', (data) => {
        if (data === 'reset') {
            console.log('Restarting Bot...');
            p.kill();
            start();
        }
    });

    p.on('exit', (code) => {
        console.error('Exited with code:', code);
        if (code === 1 || code === 0) start();
    });
}

start();
