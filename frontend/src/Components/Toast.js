const Toast = (message: string, type?: string, icon?: string) => {
  switch (type) {
    case 'error':
      return window.toastr.error(message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });

    case 'warning':
      return window.toastr.warning(message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });

    case 'success':
      return window.toastr.success(message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });

    default:
      return window.toastr.warning(message, { "showMethod": "slideDown", positionClass: 'toast-top-right', icon: 'fa fa-check', "closeButton": true });
  }
}

export default Toast
