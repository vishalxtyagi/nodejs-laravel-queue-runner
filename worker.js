const path = require('path');
const fs = require('fs');

// Configuration (you can modify these or add command-line arguments)
const config = {
    laravelPath: process.env.LARAVEL_PATH || path.resolve(__dirname, '../'),
    logFilePath: process.env.LOG_FILE_PATH || path.join(__dirname, 'worker.log'),
    queueWorkerCommand: process.env.QUEUE_WORKER_COMMAND || 'php artisan queue:work',
    restartDelay: parseInt(process.env.RESTART_DELAY) || 1000, // milliseconds
};

// Function to log messages both to console and file
function log(message, isError = false) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    if (isError) {
        console.error(logMessage);
    } else {
        console.log(logMessage);
    }
    
    fs.appendFileSync(config.logFilePath, logMessage);
}

// Function to start the queue worker
async function startQueueWorker() {
    try {
        const { execa } = await import('execa');

        log('Starting Laravel queue worker...');

        const [command, ...args] = config.queueWorkerCommand.split(' ');
        const subprocess = execa(command, args, { cwd: config.laravelPath });

        subprocess.stdout.on('data', (data) => log(data.toString()));
        subprocess.stderr.on('data', (data) => log(data.toString(), true));

        await subprocess;
    } catch (error) {
        log(`Worker process error: ${error}`, true);
    }

    log('Worker process exited. Restarting...');
    setTimeout(startQueueWorker, config.restartDelay);
}

// Main function
async function main() {
    log('Laravel Queue Worker Manager started');
    log(`Laravel path: ${config.laravelPath}`);
    log(`Log file: ${config.logFilePath}`);
    log(`Queue worker command: ${config.queueWorkerCommand}`);
    
    startQueueWorker();
}

// Start the application
main().catch(error => log(`Unhandled error: ${error}`, true));