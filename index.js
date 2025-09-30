const dockItems = document.querySelectorAll('.dock-item');

dockItems.forEach((item, index) => {
  item.addEventListener('mousemove', () => {
    dockItems.forEach((el, i) => {
      const distance = Math.abs(i - index);
      el.style.transform = `scale(${1.3 - distance * 0.1}) translateY(-${10 - distance * 3}%)`;
    });
  });
  item.addEventListener('mouseleave', () => {
    dockItems.forEach(el => {
      el.style.transform = '';
    });
  });
});

const desktop = document.querySelector('.desktop');

let zIndexCounter = 10;

// ---------------- Dock Animation ----------------
dockItems.forEach((item, index) => {
  item.addEventListener('mousemove', () => {
    dockItems.forEach((el, i) => {
      const distance = Math.abs(i - index);
      el.style.transform = `scale(${1.3 - distance * 0.1}) translateY(-${10 - distance * 3}%)`;
    });
  });
  item.addEventListener('mouseleave', () => {
    dockItems.forEach(el => {
      el.style.transform = '';
    });
  });

  // ---------------- Open Window on Click ----------------
  item.addEventListener('click', () => {
    const appName = item.alt.toLowerCase();
    // Try to find an existing window for this app
    let win = Array.from(document.querySelectorAll('.window')).find(w => {
      const titleSpan = w.querySelector('.window-title');
      return titleSpan && titleSpan.textContent === item.alt;
    });
    if (win) {
      // If minimized, restore it
      const header = win.querySelector('.window-topbar');
      const iframe = win.querySelector('.window-content');
      if (header && header.style.display === "none") {
        win.style.transition = 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.5s';
        win.style.transformOrigin = 'bottom center';
        win.style.transform = 'scaleY(1) scaleX(1) translateY(0)';
        win.style.opacity = '1';
        setTimeout(() => {
          win.style.transition = '';
          win.style.transform = '';
          win.style.opacity = '';
          iframe.classList.remove("hidden");
          header.style.display = "";
          win.style.height = "400px";
          win.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
        }, 500);
      }
      document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
      win.classList.add('active');
      setActiveWindowTitle(item.alt);
      const topbarName = document.querySelector('.topbar .name');
      if (topbarName) topbarName.textContent = item.alt;
    } else {
      // Create new window if not already open
      win = createWindow(item.alt, `apps/${appName}.html`);
      document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
      win.classList.add('active');
      setActiveWindowTitle(item.alt);
      const topbarName = document.querySelector('.topbar .name');
      if (topbarName) topbarName.textContent = item.alt;
    }
  });
});

// ---------------- Window Creation ----------------
function createWindow(title, url) {
  const win = document.createElement('div');
  win.className = "window shadow-2xl rounded-lg overflow-hidden";
  // Wider default size for calendar
  if (url.includes('calendar.html')) {
    win.style.width = "1200px";
    win.style.height = "700px";
  } else {
    win.style.width = "900px";
    win.style.height = "600px";
  }
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.zIndex = zIndexCounter++;

  win.innerHTML = `
    <div class="window-topbar">
      <div class="controls">
        <div class="close" title="Close"></div>
        <div class="minimize" title="Minimize"></div>
        <div class="fullscreen" title="Full Screen"></div>
      </div>
      <span class="window-title">${title}</span>
    </div>
    <iframe src="${url}" class="window-content" style="position:absolute; left:0; top:32px; width:100%; height:calc(100% - 32px); background:white; border:none;"></iframe>
    <div class="resizer resizer-n"></div>
    <div class="resizer resizer-s"></div>
    <div class="resizer resizer-e"></div>
    <div class="resizer resizer-w"></div>
    <div class="resizer resizer-ne"></div>
    <div class="resizer resizer-nw"></div>
    <div class="resizer resizer-se"></div>
    <div class="resizer resizer-sw"></div>
  `;

  // Make window resizable from all edges/corners
  let isResizing = false, currentResizer = null, startX, startY, startW, startH, startTop, startLeft;
  const minW = 350, minH = 200;
  win.querySelectorAll('.resizer').forEach(resizer => {
    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      currentResizer = resizer.classList[1].split('-')[1];
      const rect = win.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startW = rect.width;
      startH = rect.height;
      startTop = rect.top;
      startLeft = rect.left;
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });
  });
  document.addEventListener('mousemove', resizeWindow);
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.userSelect = '';
  });
  function resizeWindow(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let newW = startW, newH = startH, newTop = win.offsetTop, newLeft = win.offsetLeft;
    switch (currentResizer) {
      case 'n':
        newH = Math.max(minH, startH - dy);
        newTop = startTop + dy;
        break;
      case 's':
        newH = Math.max(minH, startH + dy);
        break;
      case 'e':
        newW = Math.max(minW, startW + dx);
        break;
      case 'w':
        newW = Math.max(minW, startW - dx);
        newLeft = startLeft + dx;
        break;
      case 'ne':
        newH = Math.max(minH, startH - dy);
        newTop = startTop + dy;
        newW = Math.max(minW, startW + dx);
        break;
      case 'nw':
        newH = Math.max(minH, startH - dy);
        newTop = startTop + dy;
        newW = Math.max(minW, startW - dx);
        newLeft = startLeft + dx;
        break;
      case 'se':
        newH = Math.max(minH, startH + dy);
        newW = Math.max(minW, startW + dx);
        break;
      case 'sw':
        newH = Math.max(minH, startH + dy);
        newW = Math.max(minW, startW - dx);
        newLeft = startLeft + dx;
        break;
    }
    // Restrict to viewport boundaries
    newW = Math.min(newW, viewportW - newLeft);
    newH = Math.min(newH, viewportH - newTop);
    if (newLeft < 0) {
      newW += newLeft; // shrink width if left edge goes out
      newLeft = 0;
    }
    if (newTop < 0) {
      newH += newTop; // shrink height if top edge goes out
      newTop = 0;
    }
    // Prevent window from exceeding right/bottom
    if (newLeft + newW > viewportW) newW = viewportW - newLeft;
    if (newTop + newH > viewportH) newH = viewportH - newTop;
    win.style.width = newW + 'px';
    win.style.height = newH + 'px';
    win.style.top = newTop + 'px';
    win.style.left = newLeft + 'px';
    // Adjust iframe size
    const iframe = win.querySelector('.window-content');
    iframe.style.height = (newH - 32) + 'px';
    iframe.style.width = '100%';
  }

  desktop.appendChild(win);
  makeDraggable(win);
  addWindowControls(win);
  return win;
}

// Dynamically update topbar title based on active window
function setActiveWindowTitle(title) {
  const activeWin = document.querySelector('.window.active');
  console.log(activeWin)
  if (activeWin) {
    const topbarTitle = activeWin.querySelector('.window-title');
    console.log(topbarTitle)
    if (topbarTitle) topbarTitle.textContent = title;
  }
}

// ---------------- Draggable Logic ----------------
function makeDraggable(win) {
  const topbar = win.querySelector('.window-topbar');
  let isDragging = false, offsetX, offsetY;

  topbar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndexCounter++;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = (e.clientX - offsetX) + "px";
      win.style.top = (e.clientY - offsetY) + "px";
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// ---------------- Window Controls ----------------
function addWindowControls(win) {
  // Adjust iframe size on fullscreen/minimize/restore
  function adjustIframe() {
    const iframe = win.querySelector('.window-content');
    const winRect = win.getBoundingClientRect();
    iframe.style.height = (winRect.height - 30) + 'px';
    iframe.style.width = '100%';
  }
  const closeBtn = win.querySelector('.close');
  const minimizeBtn = win.querySelector('.minimize');
  const fullscreenBtn = win.querySelector('.fullscreen');
  const iframe = win.querySelector('.window-content');
  let isMinimized = false;
  let isFullscreen = false;
  let prevRect = {};

  closeBtn.addEventListener('click', () => {
    // Close animation
    win.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s';
    win.style.transformOrigin = 'top center';
    win.style.transform = 'scaleY(0.1) scaleX(0.5) translateY(-80px)';
    win.style.opacity = '0';
    setTimeout(() => {
      win.remove();
      // Update topbar app name after closing
      const windows = document.querySelectorAll('.window');
      const topbarName = document.querySelector('.topbar .name');
      if (windows.length > 0) {
        // Show the title of the last window
        const lastWin = windows[windows.length - 1];
        const lastTitle = lastWin.querySelector('.window-title');
        if (topbarName && lastTitle) topbarName.textContent = lastTitle.textContent;
      } else {
        // Fallback to Finder
        if (topbarName) topbarName.textContent = 'Finder';
      }
    }, 400);
  });

  minimizeBtn.addEventListener('click', () => {
    const header = win.querySelector('.window-topbar');
    if (!isMinimized) {
      // Genie effect animation
      win.style.transition = 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.5s';
      win.style.transformOrigin = 'bottom center';
      win.style.transform = 'scaleY(0.1) scaleX(0.5) translateY(80px)';
      win.style.opacity = '0';
      setTimeout(() => {
        win.style.transition = '';
        win.style.transform = '';
        win.style.opacity = '';
        iframe.classList.add("hidden");
        if (header) header.style.display = "none";
        win.style.height = "40px";
        win.style.boxShadow = "none";
        isMinimized = true;
      }, 500);
    } else {
      win.style.transition = 'transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.5s';
      win.style.transformOrigin = 'bottom center';
      win.style.transform = 'scaleY(1) scaleX(1) translateY(0)';
      win.style.opacity = '1';
      setTimeout(() => {
        win.style.transition = '';
        win.style.transform = '';
        win.style.opacity = '';
        iframe.classList.remove("hidden");
        if (header) header.style.display = "";
        win.style.height = "400px";
        win.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.25)";
        isMinimized = false;
      }, 500);
    }
    adjustIframe();
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!isFullscreen) {
      prevRect = {
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height,
        borderRadius: win.style.borderRadius
      };
      win.style.left = '0px';
      win.style.top = '0px';
      win.style.width = window.innerWidth + 'px';
      win.style.height = window.innerHeight + 'px';
      win.style.borderRadius = '0';
      isFullscreen = true;
    } else {
      win.style.left = prevRect.left;
      win.style.top = prevRect.top;
      win.style.width = prevRect.width;
      win.style.height = prevRect.height;
      win.style.borderRadius = prevRect.borderRadius;
      isFullscreen = false;
    }
    adjustIframe();
  });
  // Adjust iframe on window resize
  window.addEventListener('resize', adjustIframe);
  // Initial adjust
  adjustIframe();
}

// Trash bin click handler
const binImg = document.querySelector('img[alt="Bin"]');
if (binImg) {
  binImg.addEventListener('click', () => {
    binImg.src = 'assets/dock/empty-bin.png';
  });
}

// ---------------- Dynamic Date & Time in Header ----------------
function updateHeaderDateTime() {
  // Format: Tue 30 Sep 2025 14:05
  const dateElem = document.querySelector('.topbar .date');
  const timeElem = document.querySelector('.topbar .time');
  if (!dateElem && !timeElem) return;
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  if (dateElem) dateElem.textContent = `${day} ${date} ${month} ${year}`;
  if (timeElem) timeElem.textContent = `${hours}:${minutes}`;
}

setInterval(updateHeaderDateTime, 1000);
updateHeaderDateTime();
