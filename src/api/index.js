import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;

const startAnalysis = async (payload) => {
  await axios.post(`${API_BASE}two_way_sales_analytics`, '', {
    params: payload,
    headers: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
};

const fetchInsights = async (key) => {
  const response = await axios.get(`${API_BASE}insights/${key}`);
  return await response.data;
};

const fetchStatus = async (keys) => {
  const response = await axios.get(`${API_BASE}analysis-status/${keys}`);
  return await response.data;
};

export { startAnalysis, fetchInsights, fetchStatus };
