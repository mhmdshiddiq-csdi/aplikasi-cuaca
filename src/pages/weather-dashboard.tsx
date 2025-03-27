import CurrentWeather from "@/components/current-weather";
import HourlyTemprature from "@/components/hourly-temprature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"
import WeatherDetails from "@/components/weather-details";
import { useGeolocation } from "@/hooks/use-geolocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"

const WeatherDashboard = () => {
  const { coordinates, error: locationError, isLoading: locationLoading, getLocation  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }

  }
  if (locationLoading) {
    return <WeatherSkeleton />
  }
  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={'outline'}  className="w-fit">
            <MapPin className="mr-2 h-4 w-4"/>
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }
  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location</p>
          <Button onClick={getLocation} variant={'outline'}  className="w-fit">
            <MapPin className="mr-2 h-4 w-4"/>
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const locationName = locationQuery.data?.[0];
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch data. please try again</p>
          <Button onClick={handleRefresh} variant={'outline'}  className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4"/>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return (
      <WeatherSkeleton />
    )
  }

  return (
    <div className="space-y-4">
      {/* Favorite cities */}
      <div className="flex justify-between items-center">
       <h1 className="text-xl font-bold tracking-tight">My location</h1>
        <Button variant={'outline'} size={'icon'} onClick={handleRefresh} disabled={weatherQuery.isFetching || forecastQuery.isFetching}>
        <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching ? 'animate-spin' : ''}`}/> 
       </Button>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Currently Weather */}
          <CurrentWeather dataWeather={weatherQuery.data} location={locationName} />
          {/* Hourly Temprature */}
          <HourlyTemprature data={forecastQuery.data} />
        </div>
        <div>
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* forecast */}
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard
