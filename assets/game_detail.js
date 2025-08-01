document.addEventListener("DOMContentLoaded", () => {

    const urlParams = new URLSearchParams(window.location.search);
    const gameName = decodeURIComponent(urlParams.get('name'));

    console.log('Fetching game details for:', gameName);

    fetch(`/game-info?name=${encodeURIComponent(gameName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(game => {
            console.log('Received game data:', game);

            document.getElementById('game-title').textContent = game.name;
            document.getElementById('game-price').textContent = game.price;
            document.getElementById('game-description').textContent = game.description;
            document.getElementById('game-image').src = game.image;
            document.getElementById('all-review').textContent = game.review;
            document.getElementById('release-date').textContent = game.date;
            document.getElementById('game-developer').textContent = game.developer;
            document.getElementById('game-publisher').textContent = game.publisher;

            // Display genre tags
            const tagsContainer = document.getElementById('tags-container');
            if (game.genres && game.genres !== 'Unknown') {
                game.genres.split(', ').forEach(genre => {
                    const tag = document.createElement('span');
                    tag.textContent = genre;
                    tagsContainer.appendChild(tag);
                });
            } else {
                tagsContainer.innerHTML = '<span>No genres available</span>';
            }

            // Create carousel slides
            const carousel = document.querySelector('.carousel');
            carousel.innerHTML = '';

            // Add screenshots
            if (game.screenshots && Array.isArray(game.screenshots)) {
                game.screenshots.forEach(screenshot => {
                    const slide = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = screenshot;
                    img.alt = 'Game Screenshot';
                    slide.appendChild(img);
                    carousel.appendChild(slide);
                });
            }

            // Initialize
            $('.carousel').slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 3000,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        })
        .catch(error => {
            console.error('Error loading game details:', error);
            document.querySelector('.game-details-container').innerHTML = `
                <h1>Game Not Found</h1>
                <p>The requested game could not be found.</p>
            `;
        });

    document.getElementById('back-button').addEventListener('click', () => {
        window.history.back();
    });
});
