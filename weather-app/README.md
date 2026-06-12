# 🌤️ Weather App

A modern, responsive weather application that provides real-time weather information and 5-day forecasts for any city in the world.

## Features

✨ **Key Features:**
- 🌍 Search weather for any city worldwide
- 📍 Real-time current weather conditions
- 📅 5-day weather forecast
- 💨 Detailed weather metrics (humidity, wind speed, pressure, etc.)
- 🌅 Sunrise and sunset times
- 📱 Fully responsive mobile-friendly design
- 🎨 Modern gradient UI with smooth animations
- 💡 City suggestions as you type

## Live Demo

You can view the app by opening `index.html` in your web browser after setting up your API key.

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key

### 2. Configure the App

Open `app.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const API_KEY = 'your-api-key-here';
```

### 3. Run the App

1. Open `index.html` in your web browser
2. Search for any city name
3. View the current weather and 5-day forecast

## File Structure

```
weather-app/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── app.js          # JavaScript functionality
└── README.md       # This file
```

## Usage

### Search for Weather
- Type a city name in the search box
- Press Enter or click the search button
- City suggestions will appear as you type
- Click on a suggestion to select it

### View Weather Details
- **Current Weather**: Temperature, description, and weather icon
- **Weather Metrics**: Humidity, wind speed, visibility, pressure, feels like temperature, and cloudiness
- **5-Day Forecast**: Daily forecasts with high/low temperatures
- **Sun Times**: Sunrise and sunset times

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Gradients, Animations
- **JavaScript (ES6+)**: Async/Await, Fetch API
- **OpenWeatherMap API**: Weather data provider
- **Font Awesome**: Weather icons

## API Information

### OpenWeatherMap Free Tier

- **Rate Limit**: 60 calls/minute, 1,000,000 calls/month
- **Features**: Current weather, 5-day forecast, geocoding
- **No Cost**: Free tier available for personal use

### API Endpoints Used

1. **Geocoding API**: Convert city names to coordinates
2. **Current Weather API**: Get real-time weather data
3. **Forecast API**: Get 5-day weather forecast

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Customization

### Change Default City
Modify the initialization in `app.js`:
```javascript
window.addEventListener('load', () => {
    cityInput.value = 'Your City'; // Change 'London' to your preferred city
    handleSearch();
});
```

### Change Temperature Units
In `app.js`, change the `units` parameter:
```javascript
// For Fahrenheit
const response = await fetch(
    `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
);
```

### Customize Colors
Edit the gradient colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Performance Optimization

- Lazy loads weather data
- Caches suggestions
- Optimized CSS Grid and Flexbox layout
- Minimized API calls with Promise.all()

## Error Handling

- Graceful error messages for invalid cities
- API error handling with try-catch blocks
- Loading states during data fetching
- User-friendly error notifications

## Future Enhancements

- [ ] Add hourly forecast
- [ ] Weather alerts and warnings
- [ ] Multiple city tracking
- [ ] Weather history graphs
- [ ] Dark/Light theme toggle
- [ ] Geolocation support
- [ ] Save favorite cities
- [ ] Weather radar integration

## License

This project is open source and available for personal and educational use.

## Support

For issues or questions:
1. Check your API key is valid
2. Ensure you have internet connectivity
3. Verify the city name spelling
4. Check browser console for error messages

## Author

Created as a modern weather application using OpenWeatherMap API.

---

**Happy Weather Checking!** 🌤️
