# Laravel Queue Worker Manager

This Node.js script provides a workaround for running Laravel queue workers in shared hosting environments that don't support background processes directly but do support Node.js.

## Features

- Runs Laravel queue worker in a loop
- Restarts the worker if it crashes or exits
- Logs all output to both console and file
- Configurable via environment variables

## Installation

1. Clone this repository or copy the `index.js` file to your project.
2. Install dependencies:

   ```
   npm install
   ```

## Usage

Run the script with Node.js:

```
node worker.js
```

Or use npm:

```
npm start
```

## Configuration

You can configure the script using environment variables:

- `LARAVEL_PATH`: Path to your Laravel project (default: parent directory of the script)
- `LOG_FILE_PATH`: Path to the log file (default: `worker.log` in the same directory as the script)
- `QUEUE_WORKER_COMMAND`: The command to run the queue worker (default: `php artisan queue:work`)
- `RESTART_DELAY`: Delay in milliseconds before restarting the worker after it exits (default: 1000)

Example:

```
LARAVEL_PATH=/path/to/laravel QUEUE_WORKER_COMMAND="php artisan queue:work --tries=3" node index.js
```

## License

This project is open-sourced software licensed under the MIT license.