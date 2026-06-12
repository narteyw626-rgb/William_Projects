// OpenWeatherMap API Configuration
const API_KEY = '90e28240c50e532d63ff55627ebead14'; // Get from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const suggestionsBox = document.getElementById('suggestions');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
cityInput.addEventListener('input', handleSuggestions);
document.addEventListener('click', (e) => {
    if (e.target !== cityInput && e.target !== suggestionsBox) {
        suggestionsBox.classList.remove('active');
    }
});

// Main search handler
async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        showLoading(true);
        clearError();
        
        // Get coordinates from city name
        const coords = await getCoordinates(city);
        if (!coords) {
            showError('City not found. Please try again.');
            return;
        }

        // Get current weather and forecast
        const [currentWeather, forecast] = await Promise.all([
            getCurrentWeather(coords.lat, coords.lon),
            getForecast(coords.lat, coords.lon)
        ]);

        displayWeather(currentWeather, forecast);
        suggestionsBox.classList.remove('active');
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to fetch weather data. Please check your API key.');
    } finally {
        showLoading(false);
    }
}

// Get city coordinates
async function getCoordinates(city) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();
        if (data.length === 0) return null;
        return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

// Get current weather
async function getCurrentWeather(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch current weather');
        return await response.json();
    } catch (error) {
        console.error('Current weather error:', error);
        throw error;
    }
}

// Get 5-day forecast
async function getForecast(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch forecast');
        return await response.json();
    } catch (error) {
        console.error('Forecast error:', error);
        throw error;
    }
}

// Display weather information
function displayWeather(current, forecastData) {
    // Update current weather
    document.getElementById('cityName').textContent = `${current.name}, ${current.sys.country}`;
    document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    document.getElementById('weatherIcon').alt = current.weather[0].description;

    document.getElementById('temperature').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('weatherDescription').textContent = current.weather[0].description;

    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${(current.wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressure').textContent = `${current.main.pressure} mb`;
    document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°C`;
    document.getElementById('cloudiness').textContent = `${current.clouds.all}%`;

    document.getElementById('sunrise').textContent = new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('sunset').textContent = new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Display forecast
    displayForecast(forecastData);

    // Show weather container
    weatherContainer.classList.remove('hidden');
}

// Display 5-day forecast
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    // Group forecast by day
    const dailyForecasts = {};
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });

    // Display first 5 days
    Object.values(dailyForecasts).slice(0, 5).forEach(day => {
        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-item';

        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        forecastElement.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img src="${iconUrl}" alt="${day.weather[0].description}" class="forecast-icon">
            <div class="forecast-temp">
                <div class="forecast-high">${Math.round(day.main.temp_max)}°</div>
                <div class="forecast-low">${Math.round(day.main.temp_min)}°</div>
            </div>
            <div class="forecast-description">${day.weather[0].description}</div>
        `;

        forecastContainer.appendChild(forecastElement);
    });
}

// Handle city suggestions
async function handleSuggestions() {
    const value = cityInput.value.trim();
    if (value.length < 2) {
        suggestionsBox.classList.remove('active');
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(value)}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();

        suggestionsBox.innerHTML = '';
        if (data.length === 0) {
            suggestionsBox.classList.remove('active');
            return;
        }

        data.forEach(city => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
            suggestionItem.addEventListener('click', () => {
                cityInput.value = city.name;
                suggestionsBox.classList.remove('active');
                handleSearch();
            });
            suggestionsBox.appendChild(suggestionItem);
        });

        suggestionsBox.classList.add('active');
    } catch (error) {
        console.error('Suggestions error:', error);
    }
}

// Utility functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function clearError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Initialize with default city
window.addEventListener('load', () => {
    cityInput.value = 'London';
    handleSearch();
});
