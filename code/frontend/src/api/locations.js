import axios from 'axios';

export const getLocations = async () => {
  const response = await axios.get('http://localhost:5000/api/locations'); // Ensure the URL is correct
  return response.data;
};
