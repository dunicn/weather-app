import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useState } from 'react';

const queryClient = new QueryClient()

const StyledSection = styled.div`
  width: 50%;

`

const StyledHeader = styled.h1`
  color: rgb(255, 99, 132);
`

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content:center; 
	align-items:center;
  height: 100vh;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  padding: 10px;
  margin-top: 50px;
  border-radius: 10px;
`;

const StyledButton = styled.button`
  background-color: #ff7a62;
  color: white;
  border-style: none;
  margin-top: 5px;
  &:hover {
    background-color: #ffae9f;
  }
`;
function App() {

  const [city, setCity] = useState('Oslo')

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


  const { isLoading, error, data } = useQuery([["posts", city]], () =>
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=5e6ac15bd1d9440789295012223012&q=${city}&days=5&aqi=no&alerts=no`).then(res =>
      res.json()
    )
  )

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Avg temperature by hour',
      },
    },
  };

  const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];


  const lineData = {
    labels,
    datasets: [
      {
        label: city,
        data: data.forecast ? data.forecast.forecastday[0].hour.map(elem => elem.temp_c) : undefined,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },

    ],
  };


  const handleSubmit = (e) => {
    e.preventDefault()
    const city = new FormData(e.currentTarget).get("city");
    setCity(city)
    e.target.reset();
  }



  return (
    <QueryClientProvider client={queryClient}>

      <StyledDiv>
        <StyledHeader>Simple weather app</StyledHeader>
        <StyledForm
          onSubmit={handleSubmit}
        >
          <input name="city" type="text" placeholder='City' />
          <StyledButton type="submit">Go</StyledButton>
        </StyledForm>
        <StyledSection>
          {
            data.forecast
              ? <Line options={options} data={lineData} />
              : <h2>No city found, please try again</h2>
          }
        </StyledSection>
      </StyledDiv>

    </QueryClientProvider>
  );
}

export default App;
