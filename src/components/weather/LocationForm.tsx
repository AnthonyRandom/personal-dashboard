import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useWeatherData } from "@/hooks/useWeatherData";

const locationSchema = z.object({
  location: z.string().min(1, "Please enter a city or ZIP code"),
});

type LocationFormData = z.infer<typeof locationSchema>;

export function LocationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    updateLocation, 
    isUpdatingLocation, 
    useBrowserLocation, 
    isUsingBrowserLocation, 
    userLocation 
  } = useWeatherData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
  });

  const onSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true);
    try {
      await updateLocation(data.location);
      reset();
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLocation = userLocation 
    ? [userLocation.city, userLocation.state, userLocation.country]
        .filter(Boolean)
        .join(", ")
    : "No location set";

  const handleBrowserLocation = () => {
    useBrowserLocation();
  };

  // Check if geolocation is available
  const isGeolocationAvailable = 'geolocation' in navigator;

  return (
    <Card className="dashboard-widget animate-scale-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Location Settings</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-location" className="text-sm font-medium">
            Current Location
          </Label>
          <p className="text-sm text-muted-foreground">{currentLocation}</p>
        </div>

        {/* Browser Geolocation Option */}
        {isGeolocationAvailable && (
          <>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full hover:scale-[1.02] transition-transform"
                onClick={handleBrowserLocation}
                disabled={isUsingBrowserLocation}
              >
                {isUsingBrowserLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Use My Current Location
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Update Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="location"
                placeholder="Enter city or ZIP code"
                className="pl-10 focus:ring-2 focus:ring-primary/20"
                disabled={isSubmitting || isUpdatingLocation}
                {...register("location")}
              />
            </div>
            {errors.location && (
              <p className="text-sm text-destructive animate-slide-up">
                {errors.location.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full hover:scale-[1.02] transition-transform"
            disabled={isSubmitting || isUpdatingLocation}
          >
            {(isSubmitting || isUpdatingLocation) ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Location"
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Enter a city name (e.g., "San Francisco") or ZIP code (e.g., "94102") to get weather data for that location.
        </p>
      </CardContent>
    </Card>
  );
}
