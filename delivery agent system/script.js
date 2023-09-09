// frontend/script.js
document.addEventListener("DOMContentLoaded", function() {
    const API_URL = "http://localhost:5000/api/orders"; // Update with your backend API URL

    // Function to fetch all orders from the backend
    async function fetchOrders() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    // Function to display orders on the customer dashboard
    function displayOrders(orders) {
        const orderList = document.getElementById("order-list");
        orderList.innerHTML = "";

        orders.forEach((order) => {
            const listItem = document.createElement("li");
            listItem.textContent = `Order #${order.id} | Customer: ${order.customerName} | From: ${order.fromAddress} | To: ${order.toAddress} | Delivery Date: ${order.deliveryDate} | Delivery Time: ${order.deliveryTime} | Status: ${order.status}`;
            orderList.appendChild(listItem);
        });
    }

    // Function to update the delivery status on the frontend
    function updateDeliveryStatus(orders) {
        const currentTime = new Date();

        orders.forEach((order) => {
            const deliveryTime = new Date(order.deliveryTime);
            if (currentTime >= deliveryTime && order.status !== "Order delivered") {
                order.status = "Order delivered";
            }
        });

        // Update the displayed orders with the updated status
        displayOrders(orders);
    }

    // Function to create a new order on the backend
    async function createOrder(orderData) {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const newOrder = await response.json();
            console.log("New order created:", newOrder);
            fetchOrders(); // Refresh the order list after creating a new order
            showSuccessMessage(); // Show success message after placing the order
        } catch (error) {
            console.error("Error creating order:", error);
        }
    }

    // Function to show success message
    function showSuccessMessage() {
        const successMessage = document.getElementById("success-message");
        successMessage.classList.remove("hidden");
        setTimeout(() => {
            successMessage.classList.add("hidden");
        }, 3000); // Hide the message after 3 seconds (adjust as needed)
    }

    // Event listener for the form submission
    const orderForm = document.getElementById("order-form");
    orderForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const customerName = document.getElementById("customer-name").value;
        const fromAddress = document.getElementById("from-address").value;
        const deliveryDate = document.getElementById("delivery-date").value;
        const deliveryTime = document.getElementById("delivery-time").value;
        const toAddress = document.getElementById("to-address").value;

        const orderData = {
            customerName,
            fromAddress,
            deliveryDate,
            deliveryTime, // Added the delivery time to the order data
            toAddress,
        };
        createOrder(orderData);
        orderForm.reset(); // Clear the form fields after submission
    });

    // Fetch orders when the page loads and update delivery status every minute
    fetchOrders();
    setInterval(fetchOrders, 60000); // 60000 ms = 1 minute
});