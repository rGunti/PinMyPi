$(document).ready(function() {
    var apiKeyTextBox = $('#deviceKey');
    $('#showApiKeyButton').click(function() {
        apiKeyTextBox.attr('type', (apiKeyTextBox.attr('type') === 'password') ? 'text' : 'password');
    });

    $('#resetApiKeySubmitButton').click(function() {
        $(this).prop('disabled', true);
        $.ajax({
            url: window.location.origin + window.location.pathname + '/resetKey.ajax',
            method: 'post',
            data: {
                apiKey: $('#deviceKey').val()
            }
        }).done(function() {
            // Reload page
            window.location.href = window.location.origin + window.location.pathname + '?success=2';
        }).fail(function() {
            alert('Something went wrong while resetting your Device key. Please reload the page and try again.')
        }).always(function() {
        });
    });
});