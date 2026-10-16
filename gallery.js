const GALLERY_MANIFEST = "gallery/photos.json";

let galleryPhotos = [];
let galleryCurrentIndex = 0;

async function loadGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    try {
            let manifest;

            if (window.location.protocol === "file:") {
                manifest = {
                photos: LOCAL_GALLERY_PHOTOS
            };
            } else {
                        const response = await fetch(GALLERY_MANIFEST);

                        if (!response.ok) {
                            throw new Error(`Gallery manifest unavailable: ${response.status}`);
    }

    manifest = await response.json();
}

        if (!Array.isArray(manifest.photos)) {
            throw new Error("Invalid gallery manifest");
        }

        galleryPhotos = manifest.photos.filter(photo =>
            photo.file && typeof photo.file === "string"
        );

        grid.innerHTML = "";

        galleryPhotos.forEach((photo, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "gallery-item";

            const img = document.createElement("img");
            img.src = `gallery/${encodeURIComponent(photo.file)}`;
            img.alt = photo.caption || photo.file;
            img.loading = "lazy";

            button.appendChild(img);

            const caption = document.createElement("span");
            caption.className = "gallery-item-caption";
            caption.textContent = photo.caption || photo.file;

            button.appendChild(caption);

            button.addEventListener("click", () => openGalleryPhoto(index));
            grid.appendChild(button);
        });

        console.log(`Gallery loaded: ${galleryPhotos.length} photos`);

    } catch (error) {
        console.error("Unable to load gallery:", error);
    }
}

function openGalleryPhoto(index) {
    if (!galleryPhotos.length) return;

    galleryCurrentIndex =
        (index + galleryPhotos.length) % galleryPhotos.length;

    const photo = galleryPhotos[galleryCurrentIndex];
    const viewer = document.getElementById("gallery-lightbox");

    document.getElementById("gallery-lightbox-image").src =
        `gallery/${encodeURIComponent(photo.file)}`;

    document.getElementById("gallery-lightbox-image").alt =
        photo.caption || photo.file;

    document.getElementById("gallery-lightbox-caption").textContent =
        photo.caption || "";

    viewer.hidden = false;
}

function closeGalleryPhoto() {
    const viewer = document.getElementById("gallery-lightbox");

    viewer.hidden = true;

    // Return the viewport to the Gallery section.
    const gallery = document.getElementById("gallery");

    if (gallery && gallery.classList.contains("active")) {
        gallery.scrollIntoView({
            behavior: "instant",
            block: "start"
        });
    }
}

function changeGalleryPhoto(direction) {
    openGalleryPhoto(galleryCurrentIndex + direction);
}

document.addEventListener("keydown", event => {
    const viewer = document.getElementById("gallery-lightbox");

    if (!viewer || viewer.hidden) return;

    if (event.key === "Escape") closeGalleryPhoto();
    if (event.key === "ArrowLeft") changeGalleryPhoto(-1);
    if (event.key === "ArrowRight") changeGalleryPhoto(1);
});

loadGallery();

// MOBILE SWIPE NAVIGATION
let galleryTouchStartX = 0;
let galleryTouchStartY = 0;

const galleryLightbox = document.getElementById("gallery-lightbox");

if (galleryLightbox) {

    galleryLightbox.addEventListener("touchstart", event => {
        galleryTouchStartX = event.changedTouches[0].screenX;
        galleryTouchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    galleryLightbox.addEventListener("touchend", event => {
        if (galleryLightbox.hidden) return;

        const deltaX =
            event.changedTouches[0].screenX - galleryTouchStartX;

        const deltaY =
            event.changedTouches[0].screenY - galleryTouchStartY;

        // Ignore short gestures and primarily vertical movements.
        if (Math.abs(deltaX) < 50 ||
            Math.abs(deltaX) < Math.abs(deltaY)) {
            return;
        }

        if (deltaX < 0) {
            changeGalleryPhoto(1);   // Swipe left: next picture
        } else {
            changeGalleryPhoto(-1);  // Swipe right: previous picture
        }
    }, { passive: true });

}