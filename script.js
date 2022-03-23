function Notify() {
    if (!("Notification" in window)) {
        showWarningToast("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        NotifyDesktop();
    }
    else if (Notification.permission !== "denied") {
        askForPermission(NotifyDesktop);
    }
    else if (Notification.permission === "denied") {
        showUserDeniedToast();
    }
}

const NotifyDesktop = debounce(() => RenderDesktopNotificationPopup());

function RenderDesktopNotificationPopup() {
    var id = Math.floor(Math.random() * 101);
    var notification = new Notification("A workitem has been assigned to you", {
        body: 'Workitem: '+ id +' has been assigned to by your lead',
        icon: 'enate-logo.png',
        data: id,
        dir: 'auto'
    });
    notification.onclick = function (event) {
        window.focus();
        alert('On click of a notification, we can open a workitem "'+notification.data+'" if the window is open.');
    }
    setTimeout(function () {
        notification.close();
    }, 8000);
}

function askForPermission(successCB, failureCB) {
    if (!("Notification" in window)) {
        showWarningToast("This browser does not support desktop notification");
    }
    else {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                SetCurrentPermissionStatus("Permission Granted!");
                showUserAcceptedToast();
                if (successCB) {
                    successCB();
                }
            } else if (permission === "denied") {
                SetCurrentPermissionStatus("Permission Denied!");
                showUserDeniedToast();
                if (failureCB) {
                    failureCB();
                }
            } else if (permission === "default") {
                SetCurrentPermissionStatus("Permission status: Default. Ask for permission");
            }
        });
    }
}

function SetCurrentPermissionStatus(msg) {
    document.getElementById('currentStatus').text(msg);
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

function debounce(func, timeout = 1000){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }