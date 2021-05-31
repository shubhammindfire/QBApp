// this function returns true if the session is expired else false
export default function checkSessionExpired() {
    const session_jwt = JSON.parse(localStorage.getItem("session-jwt"));

    if (session_jwt !== null) return session_jwt.expiry < new Date().getTime();
    return false;
}
