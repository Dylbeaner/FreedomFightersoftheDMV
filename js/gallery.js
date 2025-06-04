// Load and display gallery content
class GalleryManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.player = document.querySelector('.player');
        this.description = document.querySelector('.description');
        this.eventGallery = document.querySelector('.event-gallery');
        //this.currentEvent = null;
    }

    async loadGalleryData() {
        try {
            const response = await fetch('/data/videos.json');
            const data = await response.json();
            this.setupGallery(data.events);
        } catch (error) {
            //TODO REFRESH
            console.error('Error loading gallery data: REFRESH', error);
        }
    }

    setupGallery(events) {
        // Populates sidebar with event titles
        this.sidebar.innerHTML = `
            <h2>Events</h2>
            <ul class="event-list">
                ${events.map(event => `
                    <li data-event-id="${event.id}">
                        ${event.title}
                        <span class="event-date">${new Date(event.date).toLocaleDateString()}</span>
                    </li>
                `).join('')}
            </ul>
        `;

        // Add click event listeners to sidebar items
        this.sidebar.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const eventId = li.dataset.eventId;
                const event = events.find(e => e.id === eventId);
                this.displayEvent(event);

                // Update active state in sidebar
                this.sidebar.querySelectorAll('li').forEach(item =>
                    item.classList.remove('active'));
                li.classList.add('active');
            });
        });

        // Display the first event by default if you want
        if (events.length > 0) {
            this.displayEvent(events[0]);
            this.sidebar.querySelector('li').classList.add('active');
        }
    }

    displayEvent(event) {
        // Update video player
        this.player.innerHTML = `
            <div style="padding:56.25% 0 0 0;position:relative;">
                <iframe 
                    src="${event.videoUrl}"
                    <!--Be ify about this below-->
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"; 
                    style="position: absolute; top: 0;left:0;width:100%;height:100%";
                    allowFullScreen
                    loading="lazy">
                </iframe>
            </div>
        `;

        // Update description
        this.description.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description}</p>
        `;

        // Update image gallery
        this.eventGallery.innerHTML = event.images.map(image => `
            <div class="gallery-item">
                <img 
                    src="${image.thumbnail}" 
                    data-full="${image.fullSize}"
                    alt="${image.caption}"
                    onclick="showFullImage('${image.fullSize}', '${image.caption}')"
                >
            </div>
        `).join('');
    }
}

// Function to show full-size image (optional)
function showFullImage(fullSizePath, caption) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <img src="${fullSizePath}" alt="${caption}">
            <p>${caption}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new GalleryManager();
    gallery.loadGalleryData();
});
