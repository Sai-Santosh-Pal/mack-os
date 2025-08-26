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
      <span class="font-medium">${title}</span>
      <div class="controls flex gap-2">
        <div class="close w-3 h-3 bg-red-500 rounded-full cursor-pointer"></div>
        <div class="minimize w-3 h-3 bg-yellow-400 rounded-full cursor-pointer"></div>
      </div>
    </div>
    <iframe src="${url}" class="window-content w-full h-[calc(100%-30px)] bg-white"></iframe>
  `;

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
  const closeBtn = win.querySelector('.close');
  const minimizeBtn = win.querySelector('.minimize');
  const iframe = win.querySelector('.window-content');

  closeBtn.addEventListener('click', () => {
    win.remove();
  });

  minimizeBtn.addEventListener('click', () => {
    iframe.classList.toggle("hidden");
    win.style.height = iframe.classList.contains("hidden") ? "40px" : "400px";
  });
}

