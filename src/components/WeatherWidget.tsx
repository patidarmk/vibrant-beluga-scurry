import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, AlertCircle, MapPin } from 'lucide-react';
import { WeatherData } from '@/types';

// Helper function to map WMO weather codes to icons and descriptions
const getWeatherInfo = (code: number): { description: string; icon: React.ReactNode } => {
  switch (code) {
    case 0: return { description: 'Clear sky', icon: <Sun className="h-8 w-8 text-yellow-500" /> };
    case 1:
    case 2:
    case 3: return { description: 'Cloudy', icon: <Cloud className="h-8 w-8 text-gray-500" /> };
    case 45:
    case 48: return { description: 'Fog', icon: <Cloud className="h-8 w-8 text-gray-400" /> };
    case 51:
    case 53:
    case 55: return { description: 'Drizzle', icon: <CloudRain className="h-8 w-8 text-blue-400" /> };
    case 61:
    case 63:
    case 65: return { description: 'Rain', icon: <CloudRain className="h-8 w-8 text-blue-500" /> };
    case 71:
    case 73:
    case 75: return { description: 'Snow', icon: <CloudSnow className="h-8 w-8 text-blue-200" /> };
    case 80:
    case 81:
    case 82: return { description: 'Rain showers', icon: <CloudRain className="h-8 w-8 text-blue-500" /> };
    case 95:
    case 96:
    case 99: return { description: 'Thunderstorm', icon: <CloudLightning className="h-8 w-8 text-yellow-600" /> };
    default: return { description: 'Clear', icon: <Sun className="h-8 w-8 text-yellow-500" /> };
  }
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          setWeather(data.current_weather);
        })
        .catch(() => {
          setError('Could not fetch weather data.');
        });
    };

    const fetchLocationName = (lat: number, lon: number) => {
        // Using a free reverse geocoding service
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            const city = data.address.city || data.address.town || data.address.village || 'Your Location';
            setLocation(city);
          })
          .catch(() => {
            setLocation('Your Location'); // Fallback
          })
          .finally(() => {
            setLoading(false);
          });
      };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
          fetchLocationName(latitude, longitude);
        },
        () => {
          setError('Location access denied. Please enable it in your browser settings.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Card className="w-full bg-white/30 backdrop-blur-lg border-gray-200/50 shadow-2xl shadow-blue-500/10 mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-red-50 border-red-200 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-red-700 text-lg">Weather Error</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  const { description, icon } = getWeatherInfo(weather.weathercode);

  return (
    <Card className="w-full bg-white/30 backdrop-blur-lg border-gray-200/50 shadow-2xl shadow-blue-500/10 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-500" />
          {location || 'Current Weather'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-4xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</span>
          <span className="text-gray-600">{description}</span>
        </div>
        <div>{icon}</div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;