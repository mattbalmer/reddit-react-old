module.exports = {
    development: {
        env: 'development',
        port: 3000
    }
}[process.env.NODE_ENV  || 'development'];