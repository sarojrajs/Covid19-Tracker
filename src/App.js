import './App.css';
import {Card, CardContent, FormControl, MenuItem, Select} from '@material-ui/core'
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css"
function App() {

  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState('worldwide');
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState('cases');

  //https://disease.sh/v3/covid-19/countries


  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  },[]);

  useEffect(()=>{
    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2,
          }
        ));
        const sortedData=sortData(data)
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  },[countries]);

  const onCountryChange=(event)=>{
    const countryCode=event.target.value;

    const url=countryCode==='worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      console.log(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    });
  };
  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID 19 TRACKER</h1>
          <FormControl className='app__dropdown'> 
            <Select variant='outlined' value={country} onChange={onCountryChange} > 
            <MenuItem value="worldwide">World Wide</MenuItem>
            {
              countries.map(country=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>

              ))
            }
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
            <InfoBox 
            active={casesType==="cases"}
            onClick={e=>setCasesType('cases')} title="Coronavirus cases" cases={ prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
            <InfoBox 
            active={casesType==="recovered"}
            onClick={e=>setCasesType("recovered")} title="Recovered" cases= {prettyPrintStat(countryInfo.todayRecovered) } total={prettyPrintStat(countryInfo.recovered)} />
            <InfoBox 
            active={casesType==="deaths"}
            onClick={e=>setCasesType('deaths')}title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      
      <Card className='app__right'>
        <CardContent>
          <h3>Live cases by Country</h3>
            <Table countries={tableData}/>
          <h3>World Wide {casesType}</h3>
          <LineGraph casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
