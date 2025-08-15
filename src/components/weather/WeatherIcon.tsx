import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Zap,
} from "lucide-react";

interface WeatherIconProps {
  conditionCode: number;
  size?: number;
  className?: string;
}

export function WeatherIcon({ conditionCode, size = 24, className = "" }: WeatherIconProps) {
  const getIcon = (code: number) => {
    // Clear conditions
    if (code === 1000) return Sun;
    if (code === 1100) return Sun;
    
    // Cloudy conditions
    if (code === 1101) return Cloud;
    if (code === 1102) return Cloud;
    
    // Fog
    if (code === 2000) return CloudFog;
    
    // Rain conditions
    if (code >= 4000 && code <= 4201) return CloudRain;
    
    // Snow conditions
    if (code >= 5000 && code <= 5101) return CloudSnow;
    
    // Freezing conditions
    if (code >= 6000 && code <= 6201) return CloudRain;
    
    // Ice pellets
    if (code >= 7000 && code <= 7102) return CloudSnow;
    
    // Thunderstorm
    if (code === 8000) return CloudLightning;
    
    // Default
    return Cloud;
  };

  const IconComponent = getIcon(conditionCode);

  return (
    <IconComponent 
      size={size} 
      className={className}
      aria-hidden="true"
    />
  );
}

// Specialized icons for specific weather metrics
export function UVIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <Sun size={size} className={className} aria-hidden="true" />;
}

export function WindIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <Wind size={size} className={className} aria-hidden="true" />;
}

export function HumidityIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <Droplets size={size} className={className} aria-hidden="true" />;
}

export function VisibilityIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <Eye size={size} className={className} aria-hidden="true" />;
}

export function TemperatureIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <Thermometer size={size} className={className} aria-hidden="true" />;
}

export function AirQualityIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return <Zap size={size} className={className} aria-hidden="true" />;
}
