document.addEventListener("DOMContentLoaded", function() {
    const submitOrderButton = document.getElementById("submit-order");
    const addFoodItemButton = document.getElementById("add-food-item");
    const foodItemsContainer = document.getElementById("food-items-container");
    let itemCount = 1;
  
    addFoodItemButton.addEventListener("click", function() {
        itemCount++;
        const foodItemHTML = `
            <div class="food-item">
                <label for="food-name-${itemCount}">Food Name:</label>
                <select class="food-name" name="food-name">
                    <option value="" data-price="0">Select Food</option>
                    <option value="Pizza" data-price="200">Pizza - ₹200</option>
                    <option value="Burger" data-price="150">Burger - ₹150</option>
                     <option value="dosha" data-price="115">dosha - ₹115</option>
                      <option value="Momos" data-price="55">Momos - ₹55</option>
                      <option value="mug pulao" data-price="30">Mug pulao - ₹30</option>
                      <option value="frankie" data-price="45">frankie - ₹45</option>
                      <option value="gujarati thali" data-price="150">gujarati thali - ₹150</option>
                      <option value="punjabi thali" data-price="155">punjabi thali - ₹155</option>
                      <option value="south indian thali" data-price="120">south indian thali - ₹120</option>
                      <option value="north indian thali" data-price="220">north indian thali - ₹220</option>
                      <option value="manchurian" data-price="55">manchurian - ₹55</option>
                      <option value="special thali" data-price="250">special thali - ₹250</option>
                    <!-- Add more options as needed -->
                </select><br>
  
                <label for="quantity-${itemCount}">Quantity:</label>
                <input type="number" class="quantity" name="quantity" min="1"><br>
            </div>
        `;
        foodItemsContainer.insertAdjacentHTML('beforeend', foodItemHTML);
    });
  
    submitOrderButton.addEventListener("click", function(event) {
        event.preventDefault();
  
        // Clear previous error states
        clearErrors();
  
        // Get the values from the input fields
        const customerName = document.getElementById("customer-name").value.trim();
        const tableNumber = document.getElementById("table-number").value.trim();
        const phoneNumber = document.getElementById("phone-number").value.trim();
        const paymentMethod = document.getElementById("payment-method").value.trim();
        const foodItems = document.querySelectorAll(".food-item");
  
        const orders = [];
        let totalBillAmount = 0;
        let errorMessages = [];
        let firstInvalidElement = null;
  
        // Validation
        if (!customerName) {
            errorMessages.push("Customer Name is required.");
            markFieldAsInvalid(document.getElementById("customer-name"));
            if (!firstInvalidElement) firstInvalidElement = document.getElementById("customer-name");
        }
        if (!tableNumber) {
            errorMessages.push("Table Number is required.");
            markFieldAsInvalid(document.getElementById("table-number"));
            if (!firstInvalidElement) firstInvalidElement = document.getElementById("table-number");
        }
        if (!phoneNumber) {
            errorMessages.push("Phone Number is required.");
            markFieldAsInvalid(document.getElementById("phone-number"));
            if (!firstInvalidElement) firstInvalidElement = document.getElementById("phone-number");
        }
        if (!paymentMethod) {
            errorMessages.push("Payment Method is required.");
            markFieldAsInvalid(document.getElementById("payment-method"));
            if (!firstInvalidElement) firstInvalidElement = document.getElementById("payment-method");
        }
  
        let foodItemCount = 0;
        foodItems.forEach(item => {
            const foodSelect = item.querySelector(".food-name");
            const foodName = foodSelect.value;
            const price = parseFloat(foodSelect.selectedOptions[0].getAttribute("data-price"));
            const quantity = parseFloat(item.querySelector(".quantity").value);
  
            if (!foodName) {
                markFieldAsInvalid(foodSelect);
                if (!firstInvalidElement) firstInvalidElement = foodSelect;
            }
            if (isNaN(quantity) || quantity <= 0) {
                markFieldAsInvalid(item.querySelector(".quantity"));
                if (!firstInvalidElement) firstInvalidElement = item.querySelector(".quantity");
            }
            if (foodName && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0) {
                foodItemCount++;
                const orderId = generateOrderId();
                const totalAmount = quantity * price;
                totalBillAmount += totalAmount;
  
                orders.push({
                    orderId,
                    tableNumber,
                    foodName,
                    quantity,
                    totalAmount,
                    phoneNumber,
                    paymentMethod
                });
            }
        });
  
        if (foodItemCount === 0) {
            errorMessages.push("Please add at least one food item.");
            if (!firstInvalidElement) firstInvalidElement = foodItemsContainer;
        }
  
        if (errorMessages.length > 0) {
            const orderConfirmationMessage = document.getElementById("order-confirmation-message");
            orderConfirmationMessage.innerHTML = `
                <p class="order-message">${errorMessages.join('<br>')}</p>
            `;
            orderConfirmationMessage.querySelector('.order-message').classList.add('show');
            if (firstInvalidElement) {
                firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidElement.focus();
            }
            return;
        }
  
        generateOrderSummary(customerName, orders, totalBillAmount);
    });
  
    function generateOrderId() {
        return Math.floor(Math.random() * 1000000);
    }
    
    function generateOrderSummary(customerName, orders, totalBillAmount) {
        const orderMessages = orders.map(order => `
            <p class="bill-message">Order ID: ${order.orderId}</p>
            <p class="bill-message">Table Number: ${order.tableNumber}</p>
            <p class="bill-message">Food Name: ${order.foodName}</p>
            <p class="bill-message">Quantity: ${order.quantity}</p>
            <p class="bill-message">Total Amount: ₹${order.totalAmount.toFixed(2)}</p>
            <p class="bill-message">Payment Method: ${order.paymentMethod}</p>
        `).join('');
        
        const summaryMessage = `
            <h3>Order Summary</h3>
            <p class="bill-message">Customer Name: ${customerName}</p>
            ${orderMessages}
            <p class="bill-message">Total Bill Amount: ₹${totalBillAmount.toFixed(2)}</p>
            <p class="bill-message">Thank you for dining with us 😊😊!</p>
        `;
        
        const billElement = document.getElementById("order-summary");
        billElement.innerHTML = summaryMessage;
        document.querySelectorAll('.bill-message').forEach(el => el.classList.add('show'));
  
        // Optionally send email to hotel owner
        orders.forEach(order => sendEmailToHotelOwner(order.orderId, order.tableNumber, order.foodName, order.quantity, order.phoneNumber));
    }
    
    function sendEmailToHotelOwner(orderId, tableNumber, foodName, quantity, phoneNumber) {
        const emailBody = `
            Order ID: ${orderId}
            Table Number: ${tableNumber}
            Food Name: ${foodName}
            Quantity: ${quantity}
            Phone Number: ${phoneNumber}
        `;
        // TO DO: Implement email sending functionality using JavaScript or a server-side language
        console.log("Email sent to hotel owner:", emailBody);
    }
  
    function markFieldAsInvalid(field) {
        field.style.borderColor = 'red';
        field.style.borderWidth = '2px';
    }
  
    function clearErrors() {
        const fields = document.querySelectorAll('#customer-name, #table-number, #phone-number, #payment-method, .food-name, .quantity');
        fields.forEach(field => {
            field.style.borderColor = '';
            field.style.borderWidth = '';
        });
        const orderConfirmationMessage = document.getElementById("order-confirmation-message");
        if (orderConfirmationMessage) {
            orderConfirmationMessage.innerHTML = '';
            orderConfirmationMessage.querySelector('.order-message')?.classList.remove('show');
        }
    }
  });
  
