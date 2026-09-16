(function () {
  var forms = document.querySelectorAll("[data-signup]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.innerHTML =
        '<p class="signup-thanks">You’re in. The live list is next — this is still a preview.</p>';
    });
  });
})();
