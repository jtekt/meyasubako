import { CgDarkMode } from "solid-icons/cg";

export default () => {
  function loadThemeFromLocalSorage() {
    const html = document.querySelector("html");
    if (!html) return;
    const theme = localStorage.getItem("theme");
    html.setAttribute("data-theme", theme || "light");
  }

  function changeTheme() {
    const html = document.querySelector("html");
    if (!html) return;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  loadThemeFromLocalSorage();

  return (
    <button onclick={changeTheme} class="btn btn-ghost btn-circle">
      <CgDarkMode size={24} />
    </button>
  );
};
