module.exports = {
    development: {
        env: 'development',
        port: process.env.PORT || 3000
    },
    production: {
        env: 'production',
        port: process.env.PORT || 80
    }
}[process.env.NODE_ENV  || 'development'];