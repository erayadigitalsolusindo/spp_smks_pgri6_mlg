function createToast(textheader = '', position = 'top-right', message = '', type = 'success', duration = 4000) {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast-container position-fixed p-3 toast-index`;
    toastContainer.style.zIndex = '1060'; // Added z-index higher than modal (1050)

    switch (type) {
        case 'success':
            toastClass = 'alert-light-success';
            break;
        case 'warning':
            toastClass = 'alert-light-warning';
            toastPrefix = 'Warning: ';
            break;
        case 'error':
            toastClass = 'alert-light-danger';
            toastPrefix = 'Error: ';
            break;
        default:
            toastClass = 'alert-light-success';
    }

    switch (position) {
        case 'top-right':
            toastContainer.classList.add('top-0', 'end-0');
            break;
        case 'bottom-right':
            toastContainer.classList.add('bottom-0', 'end-0');
            break;
        case 'top-left':
            toastContainer.classList.add('top-0', 'start-0');
            break;
        case 'bottom-left':
            toastContainer.classList.add('bottom-0', 'start-0');
            break;
        default:
            toastContainer.classList.add('top-0', 'end-0');
    }

    const toast = document.createElement('div');
    toast.className = `toast hide toast fade`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    let toastContent = `
        <div class="toast-header ${toastClass}">
            <img class="rounded me-2" style="width:30px" src="${baseurl}/mofi/assets/images/logo/logo_amc.png" alt="profile">
            <strong class="me-auto">${textheader}</strong>
            <small>Saat Ini</small>
            <button class="btn-close" type="button" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body toast-dark">
           <i class="fa fa-bullhorn"></i> : ${message}
        </div>
    `;

    toast.innerHTML = toastContent;
    toastContainer.appendChild(toast);
    document.body.appendChild(toastContainer);

    const bsToast = new bootstrap.Toast(toast, { delay: duration });
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}
