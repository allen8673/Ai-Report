module.exports = {
    apps: [
        {
            name: 'Ai Report FE:7788',
            // exec_mode: 'cluster',
            // instances: 4, // Or a number of instances
            script: './node_modules/next/dist/bin/next',
            args: 'start',
            autorestart: true,
            watch: true,
            max_memory_restart: '1G',
            env: {
                PORT: 7788,
                NEXTAUTH_URL: "https://report-dev.nics.moda"
            }
        }
    ]
}