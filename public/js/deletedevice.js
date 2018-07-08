$(document).ready(function() {
    var deleteConfirmButton = $('#deleteDeviceConfirmButton'),
        deleteConfirmModal = $('#deleteDeviceConfirmModal');
    
    var deleteConfirmButtonTimer = null;
    
    deleteConfirmModal.on('show.bs.modal', function() {
        deleteConfirmButtonTimer = setTimeout(function() {
            console.log('Timeout reached');
            deleteConfirmButton.prop('disabled', false);
        }, 2500);
    });
    deleteConfirmModal.on('hidden.bs.modal', function() {
        if (deleteConfirmButtonTimer) {
            clearTimeout(deleteConfirmButtonTimer);
        }
        deleteConfirmButton.prop('disabled', true);
    });
});