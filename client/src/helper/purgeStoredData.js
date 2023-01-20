export default function purgeStoredData() {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
}