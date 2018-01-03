function clearForm(form) {
  // iterate over all of the inputs for the form
  // element that was passed in
  $(':input', form).each(function() {
    let type = this.type;
    let tag = this.tagName.toLowerCase(); // normalize case
    // it's ok to reset the value attr of text inputs,
    // password inputs, and textareas
    if (type === 'text' || type === 'password' || tag === 'textarea' || tag === 'email')
      this.value = "";
    // checkboxes and radios need to have their checked state cleared
    // but should *not* have their 'value' changed
    else if (type === 'checkbox' || type === 'radio')
      this.checked = false;
    // select elements need to have their 'selectedIndex' property set to -1
    // (this works for both single and multiple select elements)
    else if (tag === 'select')
      this.selectedIndex = -1;
  });
};

$(document)
  .ready(function () {
    clearForm('#id_login_form');
    clearForm('#id_registration_form');

    /*$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });*/
    $('#sidebar').mouseenter(function () {
      $('#sidebar').toggleClass('active');
    });

    $('#sidebar').mouseleave(function () {
      $('#sidebar').toggleClass('active');
    });
  });


