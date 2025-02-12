// Add this function to test the payment flow
function testPayment() {
    // Fill the form with test data
    document.getElementById('name').value = 'Test User';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('phone').value = '9999999999';
    
    // Trigger payment
    const paymentButton = document.querySelector('.payment-trigger');
    paymentButton.click();
} 