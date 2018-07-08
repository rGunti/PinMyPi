$(document).ready(function() {
    var apiKeyTextBox = $('#deviceKey');
    $('#showApiKeyButton').click(function() {
        apiKeyTextBox.attr('type', (apiKeyTextBox.attr('type') === 'password') ? 'text' : 'password');
    });
});