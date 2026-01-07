function trackOrder() {
    const orderId = document.getElementById("orderId").value.trim();
    const details = document.getElementById("orderDetails");
    const error = document.getElementById("errorMsg");

    if (orderId === "" || !orderId.startsWith("ORD-")) {
        error.style.display = "block";
        details.style.display = "none";
        return;
    }

    // Fake success (demo)
    document.getElementById("o-id").textContent = orderId;
    error.style.display = "none";
    details.style.display = "block";
}