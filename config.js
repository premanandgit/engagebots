module.exports = class config {
    static getBotName() {
        return process.env.BOT_NAME || 'Engage Bot'
    }
    static getPageToken() {
        return process.env.PAGE_ACCESS_TOKEN || 'EAAHMBZB4zZA2EBAOHoafox65ZBppjZA6F1zGN0FsxQC8umzIKp7pFIuMjc4kxzaxqzoXBDZCM5skZCuQXGpK6gsIRF8dZAqQ1VabU2yIkuZBbZBDDoXmrKNywIX15KZBXM8eZA2l7rfqk4LvPLJqQVyjp5RHdgjj1XeRX1uyDGi5uC08QZDZD'
    }
    static getPort() {
        return process.env.PORT || 3000
    }
    static getHubVerifyToken() {
        return process.env.HUB_VERIFY_TOKEN || 'yali_food_bot'
    }
    static getAssetUrl() {
        return process.env.ASSET_URL || 'https://engagebots.herokuapp.com/assets'
    }
}