document.addEventListener("DOMContentLoaded", () => {
    let gameList = [];
  
    // Load JSON file
    fetch('/assets/steam_games_backup.json')
        .then(response => response.json())
        .then(data => {
            // Fetch game data
            gameList = Object.values(data).map(game => ({
                name: game.name,
                price: game.price === 0.0 ? 'Free' : `Rp ${game.price.toLocaleString('id-ID')}`,
                developer: game.developers
                    ? `Developers: ${game.developers.join(', ')}`
                    : 'Developers: Unknown',
                publisher: game.publishers
                    ? `Publisher: ${game.publishers.join(', ')}`
                    : 'Publisher: Unknown',
                platform: game.platforms
                    ? `Platforms: ${game.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}`
                    : 'Platforms: Unknown',
                image: game.header_image || '/assets/default_image.jpg', // Use a default image if not provided
                reviews: game.review_count || 0,
                genre: game.genres || 'Unknown'
            }));

            // Get the carousel IDs
            const popularCarousel  = document.getElementById('popular-games-carousel');
            const freeCarousel = document.getElementById('free-games-carousel');
            const actionCarousel = document.getElementById('action-games-carousel');
            const rpgCarousel = document.getElementById('rpg-games-carousel');
            const strategyCarousel = document.getElementById('strategy-games-carousel');

            // Popular Games Carousel
            if ($('.popular-games-carousel').hasClass('slick-initialized')) {
                $('.popular-games-carousel').slick('unslick');
            }

            popularCarousel.innerHTML = '';

            // Top 15 List
            const popularGames = gameList.sort((a, b) => b.reviews - a.reviews).slice(0, 15); // Top 15 Games
            popularGames.forEach(game => {
                const slide = document.createElement('div');
                slide.classList.add('slide');

                const img = document.createElement('img');
                img.src = game.image
                img.alt = game.name;
                slide.appendChild(img);

                const gameInfo = document.createElement('div');
                gameInfo.classList.add('game-info');
            
                const titleElement = document.createElement('h3');
                titleElement.classList.add('game-title');
                titleElement.textContent = game.name;
                gameInfo.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.classList.add('game-price');
                priceElement.textContent = game.price;
                gameInfo.appendChild(priceElement);

                slide.appendChild(gameInfo)

                // Make the slide clickable
                slide.addEventListener('click', () => {
                    // Redirect to game details page or perform another action
                    window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
                });

                popularCarousel.appendChild(slide);
            });

            popularCarousel.style.display = 'block';
            $(popularCarousel).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    { 
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                ],
            });

            // Free Games Carousel
            if ($('.free-games-carousel').hasClass('slick-initialized')) {
                $('.free-games-carousel').slick('unslick');
            }

            freeCarousel.innerHTML = '';

            // Fetch free games
            const UniformedfreeGames = gameList.filter(game => game.price === 'Free');

            function shuffleGames(games) {
                return games.sort(() => Math.random() - 0.5);
            }

            // 15 Free games (random)
            const freeGames = shuffleGames(UniformedfreeGames).slice(0, 15);
            freeGames.forEach(game => {
                const slide = document.createElement('div');
                slide.classList.add('slide');

                const img = document.createElement('img');
                img.src = game.image
                img.alt = game.name;
                slide.appendChild(img);

                const gameInfo = document.createElement('div');
                gameInfo.classList.add('game-info');
            
                const titleElement = document.createElement('h3');
                titleElement.classList.add('game-title');
                titleElement.textContent = game.name;
                gameInfo.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.classList.add('game-price');
                priceElement.textContent = game.price;
                gameInfo.appendChild(priceElement);

                slide.appendChild(gameInfo)

                slide.addEventListener('click', () => {
                    window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
                });

                freeCarousel.appendChild(slide);
            });

            freeCarousel.style.display = 'block';
            $(freeCarousel).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    { 
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                ],
            });

            // Action Games Carousel
            if ($('.action-games-carousel').hasClass('slick-initialized')) {
                $('.action-games-carousel').slick('unslick');
            }

            actionCarousel.innerHTML = '';

            // 15 Most review 'Action' games
            const actionGames = gameList.filter(game => game.genre.includes('Action')).sort((a, b) => b.reviews - a.reviews).slice(0, 15) ; // Top 15 Games
            actionGames.forEach(game => {
                const slide = document.createElement('div');
                slide.classList.add('slide');

                const img = document.createElement('img');
                img.src = game.image
                img.alt = game.name;
                slide.appendChild(img);

                const gameInfo = document.createElement('div');
                gameInfo.classList.add('game-info');
            
                const titleElement = document.createElement('h3');
                titleElement.classList.add('game-title');
                titleElement.textContent = game.name;
                gameInfo.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.classList.add('game-price');
                priceElement.textContent = game.price;
                gameInfo.appendChild(priceElement);

                slide.appendChild(gameInfo)

                slide.addEventListener('click', () => {
                    window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
                });

                actionCarousel.appendChild(slide);
            });

            actionCarousel.style.display = 'block';
            $(actionCarousel).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    { 
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                ],
            });

            // RPG Games Carousel
            if ($('.rpg-games-carousel').hasClass('slick-initialized')) {
                $('.rpg-games-carousel').slick('unslick');
            }

            rpgCarousel.innerHTML = '';

            // 15 Most reviewed 'RPG' games
            const rpgGames = gameList.filter(game => game.genre.includes('RPG')).sort((a, b) => b.reviews - a.reviews).slice(0, 15) ; // Top 15 Games
            rpgGames.forEach(game => {
                const slide = document.createElement('div');
                slide.classList.add('slide');

                const img = document.createElement('img');
                img.src = game.image
                img.alt = game.name;
                slide.appendChild(img);

                const gameInfo = document.createElement('div');
                gameInfo.classList.add('game-info');
            
                const titleElement = document.createElement('h3');
                titleElement.classList.add('game-title');
                titleElement.textContent = game.name;
                gameInfo.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.classList.add('game-price');
                priceElement.textContent = game.price;
                gameInfo.appendChild(priceElement);

                slide.appendChild(gameInfo)

                slide.addEventListener('click', () => {
                    window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
                });

                rpgCarousel.appendChild(slide);
            });

            rpgCarousel.style.display = 'block';
            $(rpgCarousel).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    { 
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                ],
            });

            // Strategy Games Carousel
            if ($('.strategy-games-carousel').hasClass('slick-initialized')) {
                $('.strategy-games-carousel').slick('unslick');
            }

            strategyCarousel.innerHTML = '';

            // 15 Most reviewed 'Strategy' games
            const strategyGames = gameList.filter(game => game.genre.includes('Strategy')).sort((a, b) => b.reviews - a.reviews).slice(0, 15) ; // Top 15 Games
            strategyGames.forEach(game => {
                const slide = document.createElement('div');
                slide.classList.add('slide');

                const img = document.createElement('img');
                img.src = game.image
                img.alt = game.name;
                slide.appendChild(img);

                const gameInfo = document.createElement('div');
                gameInfo.classList.add('game-info');
            
                const titleElement = document.createElement('h3');
                titleElement.classList.add('game-title');
                titleElement.textContent = game.name;
                gameInfo.appendChild(titleElement);

                const priceElement = document.createElement('p');
                priceElement.classList.add('game-price');
                priceElement.textContent = game.price;
                gameInfo.appendChild(priceElement);

                slide.appendChild(gameInfo)

                slide.addEventListener('click', () => {
                    window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
                });

                strategyCarousel.appendChild(slide);
            });

            strategyCarousel.style.display = 'block';
            $(strategyCarousel).slick({
                dots: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        },
                    },
                    { 
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        },
                    },
                ],
            });
        })
        .catch(error => console.error('Error loading game data:', error));
  
    const input = document.getElementById('searchBar');
    const suggestionsBox = document.getElementById('suggestions');
    const recommendationsCarousel = document.getElementById('recommendations-carousel');
  
    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
  
        if (value.length === 0) return;
  
        // Filter the games based on the input value
        const filtered = gameList.filter(game => game.name.toLowerCase().startsWith(value)).slice(0, 10);
  
        if (filtered.length > 0) {
            filtered.forEach(game => {
                const div = document.createElement('div');
                div.textContent = game.name;
                div.onclick = () => {
                    input.value = game.name;
                    suggestionsBox.innerHTML = '';
                    suggestionsBox.style.display = 'none';
                };
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'block';
        }
    });
  
    // Hide suggestions
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container')) {
            suggestionsBox.style.display = 'none';
        }
    });

    // Feeling lucky Randomizer
    const randomizer = document.getElementById('randomizer-button');

    randomizer.addEventListener('click', () => {
        function shuffleGames(games) {
            return games.sort(() => Math.random() - 0.5);
        }

        const shuffledGames = shuffleGames(gameList);
        const game = shuffledGames[0];

        window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
    });

    // Recommendations Carousel
    // Fetch Recommendations
    document.querySelector('.search-button').addEventListener('click', () => {
        const title = input.value.trim();
        if (!title) {
            alert('Please provide a game title');
            return;
        }

        if ($('.recommendations-carousel').hasClass('slick-initialized')) {
            $('.recommendations-carousel').slick('unslick');
        }

        recommendationsCarousel.innerHTML = '';
        recommendationsCarousel.style.display = 'none';

        fetch(`/recommend?title=${encodeURIComponent(title)}`)
            .then(res => res.json())
            .then(data => {
                if (data.recommendations) {
                    // Create slides for each recommendation
                    data.recommendations.forEach(gameName => {
                        const game = gameList.find(g => g.name === gameName); // Find game details
                        if (game) {
                            const slide = document.createElement('div');
                            slide.classList.add('slide');

                            // Add game image
                            const img = document.createElement('img');
                            img.src = game.image;
                            img.alt = game.name;
                            slide.appendChild(img);

                            // Add game info
                            const gameInfo = document.createElement('div');
                            gameInfo.classList.add('game-info');
                            
                            // Separate top and bottom info
                            const topInfo = document.createElement('div');
                            topInfo.classList.add('top-info');

                            const titleElement = document.createElement('h3');
                            titleElement.classList.add('game-title');
                            titleElement.textContent = game.name;
                            topInfo.appendChild(titleElement);

                            const priceElement = document.createElement('p');
                            priceElement.classList.add('game-price');
                            priceElement.textContent = game.price;
                            topInfo.appendChild(priceElement);
                            
                            const bottomInfo = document.createElement('div');
                            bottomInfo.classList.add('bottom-info');

                            const developerElement = document.createElement('p');
                            developerElement.classList.add('game-developer');
                            developerElement.textContent = game.developer;
                            bottomInfo.appendChild(developerElement)

                            const publisherElement = document.createElement('p');
                            publisherElement.classList.add('game-publisher');
                            publisherElement.textContent = game.publisher;
                            bottomInfo.appendChild(publisherElement)

                            const platformElement = document.createElement('p');
                            platformElement.classList.add('game-platform');
                            platformElement.textContent = game.platform;
                            bottomInfo.appendChild(platformElement)

                            gameInfo.appendChild(topInfo);
                            gameInfo.appendChild(bottomInfo);

                            slide.appendChild(gameInfo);

                            slide.addEventListener('click', () => {
                                window.location.href = `/game-details?name=${encodeURIComponent(game.name)}`;
                            });

                            recommendationsCarousel.appendChild(slide);
                        }
                    });

                    recommendationsCarousel.style.display = 'block';

                    // Initialize Slick Carousel
                    $(recommendationsCarousel).slick({
                        dots: true,
                        infinite: true,
                        speed: 300,
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                },
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                },
                            },
                        ],
                    });
                } else {
                    alert(data.error)
                }
            })
            .catch(error => console.error('Error fetching recommendations:', error));
    });
});