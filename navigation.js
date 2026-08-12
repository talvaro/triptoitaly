let lastActiveMenuId = null;

function getMenuItemForDay(dayId) {
  const items = document.querySelectorAll('.sidebar .day-link');

  return Array.from(items).find(item => {
    const onclick = item.getAttribute('onclick') || '';
    return onclick.includes(`showDay('${dayId}')`);
  });
}

function setActiveMenuItem(dayId) {
  const items = document.querySelectorAll('.sidebar .day-link');

  items.forEach(item => item.classList.remove('active'));

  if (dayId === 'home' && lastActiveMenuId) {
    const previousItem = getMenuItemForDay(lastActiveMenuId);

    if (previousItem) {
      previousItem.classList.add('active');
      previousItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
  }

  const activeItem = getMenuItemForDay(dayId);

  if (activeItem) {
    activeItem.classList.add('active');
    lastActiveMenuId = dayId;
  }
}

function showDay(dayId) {

  const sections = document.querySelectorAll('.day-section');

  sections.forEach(section => {
    section.classList.remove('active');
  });

  const target = document.getElementById(dayId);

  target.classList.add('active');
  setActiveMenuItem(dayId);

  setTimeout(() => {

    if(dayId === 'home'){

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      const sidebar = document.querySelector('.sidebar');
      const activeSidebarItem = document.querySelector('.sidebar .day-link.active');

      if(sidebar && activeSidebarItem){
        activeSidebarItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
      else if(sidebar){
        sidebar.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

    }
    else{

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }

  }, 100);

}

