import { fetchCurrentWeather, getPredictionFromService } from '../services/energyService.js';

export const getEnergyData = async (req, res, next) => {
  try {
    const { lat, lon, city } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const data = await fetchCurrentWeather(lat, lon, city);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getForecastData = async (req, res, next) => {
  try {
    const { irradiance, windSpeed, temperature } = req.body;
    if (irradiance === undefined || windSpeed === undefined || temperature === undefined) {
      return res.status(400).json({ error: 'irradiance, windSpeed, and temperature are required' });
    }

    const prediction = await getPredictionFromService({ irradiance, windSpeed, temperature });
    res.json(prediction);
  } catch (error) {
    next(error);
  }
};
