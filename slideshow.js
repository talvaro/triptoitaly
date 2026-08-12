
/* ===== SIDEBAR SLIDESHOW ===== */

const sidebarImages = [

  "sidebarslideshow/slideshow1.jpg",
  "sidebarslideshow/slideshow2.jpg",
  "sidebarslideshow/slideshow3.jpg",
  "sidebarslideshow/slideshow4.jpg",
  "sidebarslideshow/slideshow5.jpg"

];

let sidebarCurrentImage = 0;

function rotateSidebarImage(){

  sidebarCurrentImage++;

  if(sidebarCurrentImage >= sidebarImages.length){
    sidebarCurrentImage = 0;
  }

  document.getElementById("slideshow-image").src =
    sidebarImages[sidebarCurrentImage];
}

/* Change image every 4 seconds */
setInterval(rotateSidebarImage, 4000);

