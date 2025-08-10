// Advanced Audio Context Setup
let audioContext;
let analyser;
let source;
const visualizer = document.getElementById('visualizer');
const visualizerCtx = visualizer.getContext('2d');
const visualizerToggle = document.getElementById('visualizer-toggle');

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// Songs data
const songs = [
    {
        title: "Barsaat Ho Jaaye",
        artist: "Jubin Nautiyal",
        src: "assets/songs/128-Barsaat Ho Jaaye - Jubin Nautiyal 128 Kbps.mp3",
        cover: "assets/images/download.jfif"
    },
    {
        title: "Hum Katha Sunate Ram Sakal Gun Dham Ki",
        artist: "Ramayana",
        src: "assets/songs/Hum Katha Sunate Ram Sakal Gun Dham Ki- [PagalWorld.NL].mp3",
        cover: "assets/images/download (1).jfif"
    },
    {
        title: "High Rated Gabru",
        artist: "Guru Randhawa",
        src: "assets/songs/High_Rated_Gabru_1.mp3",
        cover: "assets/images/High rated gabru.jfif"
    },
    {
        title: "Teri Galiyon Se Uthega Janaza Jab Mera",
        artist: "Jubin Nautiyal",
        src: "assets/songs/Teri Galiyon Se Uthega Janaza Jab Mera(PagalWorld.com.se).mp3",
        cover: "assets/images/teri galiyo se.jfif"
    },
    {
        title: "Aasman Rootha from Panchayat 3",
        artist: "Swanand Kirkire",
        src: "assets/songs/Aasman Rootha Panchayat Season 3 128 Kbps.mp3",
        cover: "assets/images/aasma rootha.jfif"
    },
    {
        title: "Sayiyaara Title Track",
        artist: "Geershati Saxena",
        src: "assets/songs/Saiyaara.unknown",
        cover: "assets/images/picture.jpg"
    },
    {
        title: "Pehli Baarish Mein",
        artist: "Geershati Saxena",
        src: "assets/songs/Pehli Barish Mein.unknown",
        cover: "assets/images/picture.jpg"
    },
    {
        title: "Bulleya",
        artist: "Geershati Saxena",
        src: "assets/songs/Bulleya.unknown",
        cover: "assets/images/picture.jpg"
    },
    {
        title:"Dhun",
        artist:"Krish Kapoor Phati Awaz Wale",
        src:"assets/songs/Dhun Saiyaara 128 Kbps.mp3",
        cover:"assets/images/Dhun.jfif"
    },
     {
        title:"O ri Chiraiya",
        artist:"Swanand Kirkire",
        src:"assets/songs/O_Ri_Chiraiya-(DownloadNe.in).mp3",
        cover:"assets/images/kirkire.jfif"
    }


];

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const currentTimeLarge = document.querySelector('.current-time-large');
const durationLarge = document.querySelector('.duration-large');
const currentSongTitle = document.querySelector('.current-song-title');
const currentSongArtist = document.querySelector('.current-song-artist');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const songGrid = document.getElementById('song-grid');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

// Playback state
let currentSongIndex = 0;
let isShuffleOn = false;
let isRepeatOn = false;
let previousVolume = 1;

// Initialize shuffle array
let shuffleOrder = [...Array(songs.length).keys()];

// Shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize
function loadSong(song) {
    title.textContent = `${song.title} - ${song.artist}`;
    currentSongTitle.textContent = song.title;
    currentSongArtist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    
    // Reset times
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    currentTimeLarge.textContent = '0:00';
    durationLarge.textContent = '0:00';
}

function playSong() {
    const musicContainer = document.querySelector('.music-container');
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    const musicContainer = document.querySelector('.music-container');
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

function prevSong() {
    if (isShuffleOn) {
        const currentIndex = shuffleOrder.indexOf(currentSongIndex);
        const prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            currentSongIndex = shuffleOrder[shuffleOrder.length - 1];
        } else {
            currentSongIndex = shuffleOrder[prevIndex];
        }
    } else {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
    }
    loadSong(songs[currentSongIndex]);
    playSong();
    updatePlaylistUI();
}

function nextSong() {
    if (isRepeatOn) {
        loadSong(songs[currentSongIndex]);
        playSong();
        return;
    }

    if (isShuffleOn) {
        const currentIndex = shuffleOrder.indexOf(currentSongIndex);
        const nextIndex = currentIndex + 1;
        if (nextIndex >= shuffleOrder.length) {
            shuffleOrder = shuffleArray([...Array(songs.length).keys()]);
            currentSongIndex = shuffleOrder[0];
        } else {
            currentSongIndex = shuffleOrder[nextIndex];
        }
    } else {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
    }
    loadSong(songs[currentSongIndex]);
    playSong();
    updatePlaylistUI();
}

// Format time in minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update all time displays
    const formattedCurrentTime = formatTime(currentTime);
    const formattedDuration = formatTime(duration);
    
    currentTimeEl.textContent = formattedCurrentTime;
    currentTimeLarge.textContent = formattedCurrentTime;
    
    if (duration) {
        durationEl.textContent = formattedDuration;
        durationLarge.textContent = formattedDuration;
    }
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function updatePlaylistUI() {
    const tiles = songGrid.querySelectorAll('.song-tile');
    tiles.forEach((tile, index) => {
        if (index === currentSongIndex) {
            tile.classList.add('playing');
        } else {
            tile.classList.remove('playing');
        }
    });
}

// Populate playlist with tiles
function populatePlaylist() {
    songs.forEach((song, index) => {
        const tile = document.createElement('div');
        tile.className = 'song-tile';
        tile.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        `;
        tile.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playSong();
            updatePlaylistUI();
        });
        songGrid.appendChild(tile);
    });
}

// Search functionality
const searchInput = document.getElementById('search-input');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');

function filterSongs(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const tiles = document.querySelectorAll('.song-tile');
    
    tiles.forEach(tile => {
        const title = tile.querySelector('.song-title').textContent.toLowerCase();
        const artist = tile.querySelector('.song-artist').textContent.toLowerCase();
        
        if (title.includes(normalizedQuery) || artist.includes(normalizedQuery)) {
            tile.style.display = 'flex';
            tile.animate([
                { opacity: 0, transform: 'scale(0.95)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        } else {
            tile.style.display = 'none';
        }
    });
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// View toggle
function toggleView(view) {
    const songGrid = document.getElementById('song-grid');
    const tiles = document.querySelectorAll('.song-tile');
    
    if (view === 'list') {
        songGrid.style.gridTemplateColumns = '1fr';
        tiles.forEach(tile => {
            tile.style.flexDirection = 'row';
            tile.style.alignItems = 'center';
            tile.style.gap = '2rem';
        });
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    } else {
        songGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        tiles.forEach(tile => {
            tile.style.flexDirection = 'column';
            tile.style.alignItems = 'stretch';
            tile.style.gap = '0.8rem';
        });
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    }
}

// Audio visualizer
function setupVisualizer() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;
    
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        
        analyser.getByteFrequencyData(dataArray);
        
        visualizerCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        visualizerCtx.fillRect(0, 0, visualizer.width, visualizer.height);
        
        const barWidth = (visualizer.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            
            const gradient = visualizerCtx.createLinearGradient(0, 0, 0, visualizer.height);
            gradient.addColorStop(0, '#c4f70bff');
            gradient.addColorStop(1, '#0df6f2ff');
            
            visualizerCtx.fillStyle = gradient;
            visualizerCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    drawVisualizer();
}

// Event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = document.querySelector('.music-container').classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
        setupVisualizer();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

progressContainer.addEventListener('click', setProgress);

// Volume control
volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value / 100;
    audio.volume = value;
    previousVolume = value;
    
    // Update volume icon
    if (value === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
});

volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        previousVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.className = 'fas fa-volume-mute';
    } else {
        audio.volume = previousVolume;
        volumeSlider.value = previousVolume * 100;
        volumeIcon.className = previousVolume < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
    }
});

// Shuffle control
shuffleBtn.addEventListener('click', () => {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.classList.toggle('active');
    if (isShuffleOn) {
        shuffleOrder = shuffleArray([...Array(songs.length).keys()]);
        showToast('Shuffle mode: On');
    } else {
        shuffleOrder = [...Array(songs.length).keys()];
        showToast('Shuffle mode: Off');
    }
});

// Repeat control
repeatBtn.addEventListener('click', () => {
    isRepeatOn = !isRepeatOn;
    repeatBtn.classList.toggle('active');
    showToast(`Repeat mode: ${isRepeatOn ? 'On' : 'Off'}`);
});

// Update time on audio load
audio.addEventListener('loadedmetadata', () => {
    const formattedDuration = formatTime(audio.duration);
    durationEl.textContent = formattedDuration;
    durationLarge.textContent = formattedDuration;
});

// Additional event listeners
searchInput.addEventListener('input', (e) => {
    filterSongs(e.target.value);
});

gridViewBtn.addEventListener('click', () => toggleView('grid'));
listViewBtn.addEventListener('click', () => toggleView('list'));

visualizerToggle.addEventListener('click', () => {
    const visualizer = document.querySelector('.music-visualizer');
    visualizer.style.display = visualizer.style.display === 'none' ? 'block' : 'none';
    showToast(`Visualizer ${visualizer.style.display === 'none' ? 'hidden' : 'shown'}`);
});

// Window resize handler for visualizer
window.addEventListener('resize', () => {
    if (visualizer) {
        visualizer.width = visualizer.offsetWidth;
        visualizer.height = visualizer.offsetHeight;
    }
});

// Handle audio ended
audio.addEventListener('ended', () => {
    showToast('Playing next song...');
    nextSong();
});

// Initialize
loadSong(songs[currentSongIndex]);
populatePlaylist();
showToast('Welcome to Harmony Hub! 🎵');

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        const isPlaying = document.querySelector('.music-container').classList.contains('play');
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    } else if (e.code === 'ArrowLeft') {
        prevSong();
    } else if (e.code === 'ArrowRight') {
        nextSong();
    }
});