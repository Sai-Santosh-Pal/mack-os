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
    // Use alt name as filename (ex: finder -> finder.html)
    const appName = item.alt.toLowerCase();
    createWindow(item.alt, `apps/${appName}.html`);
  });
});

// ---------------- Window Creation ----------------
function createWindow(title, url) {
  const win = document.createElement('div');
  win.className = "window absolute bg-gray-900 shadow-2xl rounded-lg overflow-hidden";
  win.style.width = "600px";
  win.style.height = "400px";
  win.style.top = "100px";
  win.style.left = "100px";
  win.style.zIndex = zIndexCounter++;

  win.innerHTML = `
    <div class="window-topbar bg-gray-800 text-white flex justify-between items-center px-3 py-1 cursor-move">
      <div class="controls flex gap-2">
        <div class="close w-3 h-3 bg-red-500 rounded-full cursor-pointer" title="Close"></div>
        <div class="minimize w-3 h-3 bg-yellow-400 rounded-full cursor-pointer" title="Minimize"></div>
        <div class="fullscreen w-3 h-3 bg-green-500 rounded-full cursor-pointer" title="Full Screen"></div>
      </div>
      <span class="font-medium">${title}</span>
    </div>
    <iframe src="${url}" class="window-content absolute left-0 top-[30px] w-full h-[calc(100%-30px)] bg-white" style="border:none;"></iframe>
    <div class="resizer-se absolute w-4 h-4 right-0 bottom-0 cursor-se-resize z-10"></div>
  `;
  // Make window resizable
  const resizer = win.querySelector('.resizer-se');
  let isResizing = false, startX, startY, startW, startH;
  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = win.getBoundingClientRect();
    startW = rect.width;
    startH = rect.height;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', resizeWindow);
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.userSelect = '';
  });
  function resizeWindow(e) {
    if (!isResizing) return;
    let newW = Math.max(350, startW + (e.clientX - startX));
    let newH = Math.max(200, startH + (e.clientY - startY));
    win.style.width = newW + 'px';
    win.style.height = newH + 'px';
    // Adjust iframe size
    const iframe = win.querySelector('.window-content');
    iframe.style.height = (newH - 30) + 'px';
    iframe.style.width = '100%';
  }

  desktop.appendChild(win);

  makeDraggable(win);
  addWindowControls(win);
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
    win.remove();
  });

  minimizeBtn.addEventListener('click', () => {
    if (!isMinimized) {
      iframe.classList.add("hidden");
      win.style.height = "40px";
      isMinimized = true;
    } else {
      iframe.classList.remove("hidden");
      win.style.height = "400px";
      isMinimized = false;
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
      win.style.left = '0';
      win.style.top = '0';
      win.style.width = '100vw';
      win.style.height = '100vh';
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

