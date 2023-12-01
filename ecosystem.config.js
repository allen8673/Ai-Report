module.exports = {
    apps: [
        {
            name: 'my nextjs app',
            // exec_mode: 'cluster',
            // instances: 4, // Or a number of instances
            script: './node_modules/next/dist/bin/next',
            args: 'start',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                PORT: 4000
            }
        }
    ]
}