(function () {
  var forms = document.querySelectorAll("[data-signup]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.innerHTML =
        '<p class="signup-thanks">Thanks. The real list is not live yet — this is a preview. Beehiiv comes next.</p>';
    });
  });
})();
