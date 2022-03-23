function Notify() {
    if (!("Notification" in window)) {
        showWarningToast("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        RenderDesktopNotificationPopup();
    }
    else if (Notification.permission !== "denied") {
        askForPermission(RenderDesktopNotificationPopup);
    }
    else if (Notification.permission === "denied") {
        showUserDeniedToast();
    }
}

function RenderDesktopNotificationPopup() {
    var notification = new Notification("Title", {
        body:'HTML5 Web Notification API',
        // icon:'http://i.stack.imgur.com/Jzjhz.png?s=48&g=1', 
        icon:'enate-logo.png', 
        dir:'auto'
    });
}

function askForPermission(successCB, failureCB) {
    if (!("Notification" in window)) {
        showWarningToast("This browser does not support desktop notification");
    }
    else {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                showUserAcceptedToast();
                if (successCB) {
                    successCB();
                }
            } else if (permission === "denied") {
                showUserDeniedToast();
                if (failureCB) {
                    failureCB();
                }
            }
        });
    }
}

function GetCurrentPermissionStatus() {
    
}

function showUserDeniedToast() {
    showWarningToast('User has denied the permission for desktop notifications.');
}

function showUserAcceptedToast() {
    showSuccessToast('User has accepted the permission for desktop notifications.');
}

function showWarningToast(msg) {
    document.getElementById('warningMsg').text = msg;
    showToast('warningToast');
}

function showSuccessToast(msg) {
    document.getElementById('successMsg').text = msg;
    showToast('successToast');
}

function showToast(id) {
    var toast = document.getElementById(id);
    if (toast) {
        new bootstrap.Toast(document.getElementById(id)).show();
    }
}