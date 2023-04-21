import jwtDecode from 'jwt-decode';

export function hasToken() {
    const token = localStorage.getItem('token');

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    } catch (error) {
        return false;
    }
}
