document.addEventListener("DOMContentLoaded", function() {
    const submitOrderButton = document.getElementById("submit-order");
    submitOrderButton.addEventListener("click", function(event) {
      event.preventDefault();
      
      // Get the values from the input fields
      const tableNumber = document.getElementById("table-number").value;
      const foodSelect = document.getElementById("food-name");
      const foodName = foodSelect.value;
      const price = parseFloat(foodSelect.selectedOptions[0].getAttribute("data-price")); // Get the price based on selected food
      const quantity = parseFloat(document.getElementById("quantity").value);
      const phoneNumber = document.getElementById("phone-number").value;
      const paymentMethod = document.getElementById("payment-method").value;
      
      // Validate the input fields
      if (!tableNumber || !foodName || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0 || !phoneNumber) {
        const orderConfirmationMessage = document.getElementById("order-confirmation-message");
        orderConfirmationMessage.innerHTML = `
          <p class="order-message">Please fill in all fields correctly before submitting your order.</p>
        `;
        orderConfirmationMessage.querySelector('.order-message').classList.add('show');
        return;
      }
      
      // Proceed with order processing if all fields are filled
      const orderId = generateOrderId();
      const totalAmount = quantity * price;
      const orderMessage = `
        <p class="order-message">Your order is confirmed! Your order ID is ${orderId}.</p>
        <p class="order-message">You have ordered ${quantity} ${foodName}(s) for table ${tableNumber}.</p>
        <p class="order-message">Your food will be ready in 30 minutes. Please proceed to table ${tableNumber} to collect your order.</p>
        <p class="order-message">Thank you for dining with us 😊😊!</p>
      `;
      document.getElementById("order-confirmation-message").innerHTML = orderMessage;
      document.querySelectorAll('.order-message').forEach(el => el.classList.add('show'));
      
      generateBill(totalAmount, quantity, foodName, paymentMethod);
      
      // Send email to hotel owner with order details
      sendEmailToHotelOwner(orderId, tableNumber, foodName, quantity, phoneNumber);
    });
    
    function generateOrderId() {
      return Math.floor(Math.random() * 1000000);
    }
    
    function generateBill(totalAmount, quantity, foodName, paymentMethod) {
      const billMessage = `
        <p class="bill-message">Your bill amount is ₹${totalAmount.toFixed(2)} for ${quantity} ${foodName}(s).</p>
        <p class="bill-message">Payment Method: ${paymentMethod}</p>
        <p class="bill-message">Thank you for dining with us 😊😊!</p>
      `;
      const billElement = document.getElementById("orderNow");
      billElement.innerHTML = billMessage;
      document.querySelectorAll('.bill-message').forEach(el => el.classList.add('show'));
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
  });
  



