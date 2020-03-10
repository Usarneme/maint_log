export default function toggleDarkMode() {
  const themeSwitchCheckbox = document.getElementById('themeSwitch')
  if (!themeSwitchCheckbox) return

  themeSwitchCheckbox.addEventListener('change', function(event) {
    (event.target.checked) ? document.body.setAttribute('data-theme', 'dark') : document.body.removeAttribute('data-theme');
  })
}
