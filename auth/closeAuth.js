export const getCloseAuth = () => ({
    auth: {
        username: process.env.CLOSE_API_KEY,
        password: ''
    }
});