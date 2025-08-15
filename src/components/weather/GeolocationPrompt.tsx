import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, X } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";

interface GeolocationPromptProps {
  onDismiss: () => void;
}

export function GeolocationPrompt({ onDismiss }: GeolocationPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { useBrowserLocation, isUsingBrowserLocation } = useWeatherData();

  // Check if geolocation is available
  const isGeolocationAvailable = 'geolocation' in navigator;

  const handleUseLocation = () => {
    useBrowserLocation();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  // Auto-dismiss if geolocation is not available
  useEffect(() => {
    if (!isGeolocationAvailable) {
      setIsDismissed(true);
      onDismiss();
    }
  }, [isGeolocationAvailable, onDismiss]);

  if (isDismissed || !isGeolocationAvailable) {
    return null;
  }

  return (
    <Card className="dashboard-widget animate-scale-in border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Use Your Location
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Allow location access to automatically get weather data for your current location.
        </p>

        <div className="flex gap-2">
          <Button
            onClick={handleUseLocation}
            disabled={isUsingBrowserLocation}
            className="flex-1 hover:scale-[1.02] transition-transform"
          >
            {isUsingBrowserLocation ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDismiss}
            disabled={isUsingBrowserLocation}
          >
            Skip
          </Button>
        </div>

        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Your location data is only used to fetch weather information and is stored securely.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
