var gameInit = function () {
  //get email from session storage
  var email = sessionStorage.getItem('email'); // localStorage.getItem("email");

  const gameSrc = `https://your-web-host.com/games/daroneGame?email=${email}`;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = gameSrc;
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.setAttribute('allow', 'autoplay; fullscreen');

  // Add iframe to container
  const container = document.getElementById('game-container');
  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  resizeGame();

  container.appendChild(iframe);

  // Listen for resize events
  window.addEventListener('resize', resizeGame);

  // Function to resize game
  function resizeGame() {
    const aspectRatio = 720 / 1280;
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    if (windowAspectRatio > aspectRatio) {
      container.style.width = `${window.innerHeight * aspectRatio}px`;
      container.style.height = `${window.innerHeight}px`;
    } else {
      container.style.width = `${window.innerWidth}px`;
      container.style.height = `${window.innerWidth / aspectRatio}px`;
    }
  }
};
