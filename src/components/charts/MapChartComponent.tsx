import React from 'react';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'antd';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

interface CountryData {
  name: string;
  value: number;
}

interface GeographiesType {
  geographies: {
    properties: {
      name: string;
    };
    rsmKey: string;
  }[];
}

const MapChartComponent = ({ data }: { data: CountryData[] }) => {
  const colorScale = scaleLinear<string, string>()
    .domain([0, Math.max(...data.map((d) => d.value))])
    .range(['#ECEFF1', '#FF5722']);

  const getCountryValue = (countryName: string) => {
    const countryData = data.find((country) => country.name === countryName);
    return countryData ? countryData.value : 0;
  };

  return (
    <div>
      <ComposableMap projectionConfig={{ scale: 120 }}>
        <Sphere id="sphere" fill="none" stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }: GeographiesType) =>
            geographies.map((geo) => {
              const countryName = geo.properties.name;
              const value = getCountryValue(countryName);

              // Ensure only countries are selectable, and oceans or Antarctica are not.
              if (!countryName || countryName === 'Antarctica' || value === 0) return null;

              return (
                <Tooltip title={`${countryName}: ${value}`} key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    fill={colorScale(value)}
                    stroke="#D6D6D6"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#FF7043' },
                      pressed: { outline: 'none' },
                    }}
                  />
                </Tooltip>
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapChartComponent;
