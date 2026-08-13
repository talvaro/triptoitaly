/* ===== SIDEBAR SLIDESHOW ===== */

const SLIDESHOW_FOLDER = "sidebarslideshow";
const SLIDESHOW_PREFIX = "slideshow";
const SLIDESHOW_EXTENSION = ".jpg";

let sidebarImages = [];
let sidebarCurrentImage = 0;
let slideshowTimer = null;

/* ---------------------------------------------------
   Discover slideshow images automatically
   slideshow1.jpg, slideshow2.jpg, slideshow3.jpg...
   --------------------------------------------------- */
async function loadSidebarImages() {
    sidebarImages = [];
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
    console.log(
        "Slideshow images found:",
        sidebarImages.length
    );
}

/* ---------------------------------------------------
   Test whether an image exists
   --------------------------------------------------- */

function imageExists(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src + "?check=" + Date.now();
    });
}

/* ---------------------------------------------------
   Rotate to next image
   --------------------------------------------------- */
function rotateSidebarImage() {
    if (sidebarImages.length <= 1) {
        return;
    }
    sidebarCurrentImage++;
    if (sidebarCurrentImage >= sidebarImages.length) {
        sidebarCurrentImage = 0;
    }
    const slideshowImage =
        document.getElementById("slideshow-image");
    if (slideshowImage) {
        slideshowImage.src =
            sidebarImages[sidebarCurrentImage];
    }
}

/* ---------------------------------------------------
   Start slideshow
   --------------------------------------------------- */
function startSidebarSlideshow() {
    if (sidebarImages.length === 0) {
        return;
    }
    /*
       Make sure first discovered image is displayed
    */
    const slideshowImage =
        document.getElementById("slideshow-image");
    if (slideshowImage) {
        slideshowImage.src =
            sidebarImages[0];
    }

    sidebarCurrentImage = 0;

    /*
       If there is only one image,
       nothing needs to rotate.
    */

    if (sidebarImages.length <= 1) {
        return;
    }
    /*
       Prevent duplicate timers
    */

    if (slideshowTimer) {
        clearInterval(slideshowTimer);
    }
    /*
       Change image every 4 seconds
    */

    slideshowTimer =
        setInterval(
            rotateSidebarImage,
            4000
        );
}