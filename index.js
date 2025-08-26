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