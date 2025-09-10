export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type WeatherData = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
};