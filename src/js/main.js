var sidebar = document.querySelector(".sidebar");
var sidebarHamburger = document.querySelector(".sidebar-mobile .hamburger");
sidebarHamburger.addEventListener("click", function() {
  sidebar.classList.toggle("show");
  sidebarHamburger.classList.toggle("is-active");
});

var tableOfContentsUl = document.querySelectorAll(
  ".sidebar ul.table-of-contents ul"
);
for (var li of tableOfContentsUl) {
  li.addEventListener("click", function() {
    sidebar.classList.remove("show");
    sidebarHamburger.classList.remove("is-active");
  });
}
