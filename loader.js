// JavaScript to automatically add and control the loader
document.addEventListener("DOMContentLoaded", function() {
  // Create the loader container element
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'loader-container';
  loaderContainer.id = 'loader';

  // Create the loader logo element
  const loaderLogo = document.createElement('img');
  loaderLogo.src = 'favicon_io/android-chrome-192x192.png'; // Replace with your loader image path
  loaderLogo.alt = 'Loading...';
  loaderLogo.className = 'loader-logo';

  // Append the loader logo to the loader container
  loaderContainer.appendChild(loaderLogo);

  // Append the loader container to the body
  document.body.appendChild(loaderContainer);

  // Track the start time of the loader
  const loaderStartTime = new Date().getTime();

  // Function to remove the loader
  function removeLoader() {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - loaderStartTime;

      const minimumLoaderTime = 1500;
      const remainingTime = minimumLoaderTime - elapsedTime;

      // If the remaining time is positive, wait that amount before removing the loader
      if (remainingTime > 0) {
          setTimeout(() => {
              loaderContainer.style.opacity = '0';
              loaderContainer.style.transition = 'opacity 0.5s ease-out';
              setTimeout(() => {
                  loaderContainer.style.display = 'none';
              }, 500);
          }, remainingTime);
      } else {
          loaderContainer.style.opacity = '0';
          loaderContainer.style.transition = 'opacity 0.5s ease-out';
          setTimeout(() => {
              loaderContainer.style.display = 'none';
          }, 1000);
      }
  }

  // Listen for the window load event to remove the loader
  window.addEventListener('load', removeLoader);

  // Fallback: Ensure the loader is removed after a maximum time
  setTimeout(removeLoader, 5000); // Remove the loader after 5 seconds if not removed already
});
