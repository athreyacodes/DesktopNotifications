var BrowserSettings = {
    Chrome: "For Chrome, You can change permissions in Settings > Privacy and security > Site Settings > Notifications",
    "Microsoft Edge": "For Microsoft Edge, You can change permissions in Cookies and site notifications > All permissions > Notifications",
    Firefox: "For Firefox, You can change permissions in Settings > Privacy & Security > Permissions > Notifications"
}

window.addEventListener('load', function() {
    SetMessage("Permission status: Default. Ask for permission", "currentStatus");
    SetMessage(BrowserSettings[GetBrowser()] || "", "BrowserSetting");
    askForPermission();
});



const Notify = debounce(() => DebounceNotify());
const NotifyDesktop = debounce(() => DebounceNotifyDesktop());

function DebounceNotify() {
    setTimeout(() => {
        if(document.hasFocus()) {
            var id = Math.floor(Math.random() * 101);
            showSuccessToast('Workitem: '+ id +' has been assigned to by your lead');
        } else {
            NotifyDesktop();
        }
    }, 3000);
}

function DebounceNotifyDesktop() {
    if (!("Notification" in window)) {
        showWarningToast("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        SetMessage("Permission Granted!", "currentStatus");
        RenderDesktopNotificationPopup();
    }
    else if (Notification.permission !== "denied") {
        askForPermission();
    }
    else if (Notification.permission === "denied") {
        SetMessage("Permission Denied!", "currentStatus");
        showUserDeniedToast();
    }
}



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
                showUserAcceptedToast();
                if (successCB) {
                    successCB();
                }
            } else if (permission === "denied") {
                showUserDeniedToast();
                if (failureCB) {
                    failureCB();
                }
            } else if (permission === "default") {
                SetMessage("Permission status: Default. Ask for permission", "currentStatus");
            }
        });
    }
}

function SetMessage(msg, id) {
    document.getElementById(id).innerHTML = msg;
}

function showUserDeniedToast() {
    SetMessage("Permission Denied!", "currentStatus");
    showWarningToast('User has denied the permission for desktop notifications.');
}

function showUserAcceptedToast() {
    SetMessage("Permission Granted!", "currentStatus");
    showSuccessToast('User has accepted the permission for desktop notifications.');
}

function showWarningToast(msg) {
    document.getElementById('warningMsg').innerHTML = msg;
    showToast('warningToast');
}

function showSuccessToast(msg) {
    document.getElementById('successMsg').innerHTML = msg;
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

  function IsChrome() {
    return GetBrowser() === 'Chrome';
  }

  function IsFirefox() {
    return GetBrowser() === 'Firefox';
  }

  function IsEdge() {
    return GetBrowser() === 'Microsoft Edge';
  }

  function GetBrowser() {
    return bowser &&
    bowser.getParser(window.navigator.userAgent) &&
    bowser.getParser(window.navigator.userAgent).parsedResult &&
    bowser.getParser(window.navigator.userAgent).parsedResult.browser &&
    bowser.getParser(window.navigator.userAgent).parsedResult.browser.name;
  }