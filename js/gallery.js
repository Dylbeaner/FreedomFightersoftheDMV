// Load and display gallery content
class GalleryManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.player = document.querySelector('.player');
        this.description = document.querySelector('.description');
        this.eventGallery = document.querySelector('.event-gallery');
        this.events = []; // Store events data
    }

    async loadGalleryData() {
        try {
            const response = await fetch('/data/videos.json');
            const data = await response.json();
            this.events = data.events; // Store the events
            this.setupGallery(this.events);
        } catch (error) {
            //TODO REFRESH?
            console.error('Error loading gallery data: REFRESH', error);
        }
    }

    setupGallery(events) {
        const eventList = this.sidebar.querySelector('.event-list');
        
        // Only populate the event list
        eventList.innerHTML = events.map(event => `
        <li data-event-id="${event.id}">
            <span class="title-text">${event.title}</span>
            <span class="event-date">${new Date(event.date).toLocaleDateString()}</span>
        </li>
    `).join('');

        // Add search functionality
        const searchInput = this.sidebar.querySelector('#eventSearch');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

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

        // Display the first event by default
        if (events.length > 0) {
            this.displayEvent(events[0]);
            this.sidebar.querySelector('li').classList.add('active');
        }
    }

handleSearch(searchTerm) {
    const listItems = this.sidebar.querySelectorAll('.event-list li');
    
    listItems.forEach(item => {
        const title = item.textContent;
        const searchLower = searchTerm.toLowerCase();
        const titleLower = title.toLowerCase();

        if (titleLower.includes(searchLower)) {
            item.style.display = '';
            
            if (searchTerm.length > 0) {
                const matchStart = titleLower.indexOf(searchLower);
                const matchEnd = matchStart + searchTerm.length;
                
                // Get the exact case from the original text
                const matchedText = title.substring(matchStart, matchEnd);
                
                // Create the new HTML with only the matched part wrapped
                item.innerHTML = 
                    title.substring(0, matchStart) +
                    `<span class="matched-text">${matchedText}</span>` +
                    title.substring(matchEnd);
                    
                // Preserve the date element if it exists
                const date = item.querySelector('.event-date');
                if (date) {
                    item.appendChild(date);
                }
            } else {
                // Reset to original structure when search is empty
                const dateText = item.querySelector('.event-date')?.textContent || '';
                item.textContent = title;
                if (dateText) {
                    const dateSpan = document.createElement('span');
                    dateSpan.className = 'event-date';
                    dateSpan.textContent = dateText;
                    item.appendChild(dateSpan);
                }
            }
        } else {
            item.style.display = 'none';
        }
    });
}

    //TODO MODIFY
    displayEvent(event) {
        // Update video player
        this.player.innerHTML = `
            <div style="padding:56.25% 0 0 0;position:relative;">
                <iframe 
                    src="${event.videoUrl}"
                    <!--Be iffy about this below-->
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

// Function opens images
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

// Initializes the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new GalleryManager();
    gallery.loadGalleryData();
});