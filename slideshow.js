
/* ===== SIDEBAR SLIDESHOW ===== */

const SLIDESHOW_FOLDER = "sidebarslideshow";
const SLIDESHOW_PREFIX = "slideshow";
const SLIDESHOW_EXTENSION = ".jpg";

let sidebarImages = [];

async function loadSidebarImages() {
    let i = 1;
    while (true) {
        const image =
            `${SLIDESHOW_FOLDER}/${SLIDESHOW_PREFIX}${i}${SLIDESHOW_EXTENSION}`;
        const exists =
            await imageExists(image);
        if (!exists) {
            break;
        }
        sidebarImages.push(image);
        i++;
    }
    // Optional fallback
    if (sidebarImages.length === 0) {
        sidebarImages.push(
            "images/default-slideshow.jpg"
        );
    }
}

function imageExists(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}

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

