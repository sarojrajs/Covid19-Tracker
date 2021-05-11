import React from 'react'
import numeral from "numeral"; 
import {Circle ,Popup} from 'react-leaflet';
export const sortData=(data)=>{
    const sortedData=[...data];
    sortedData.sort((a,b)=>{
        if(a.cases>b.cases){
            return -1;
        }else{
            return 1;
        }
    })
    return sortedData;
};

const casesTypeColors={
    cases:{
        hex:'#CC1034',
        multplier:300,
    },
    recovered:{
        hex:'#7dd71d',
        multplier:400,
    },
    deaths:{
        hex:'#fb4443',
        multplier:500,
    },
};

export const prettyPrintStat=(stat)=>
stat ? `+${numeral(stat).format("0.0a")}` : "+0";
export const showDataOnMap=(data,casesType)=>
    data.map(country=>(
        <Circle 
        center={[country.countryInfo.lat,country.countryInfo.long]}
        fillOpacity={0.4}
        //{casesTypeColors[casesType].hex}
         color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].rgb}
        radius={Math.sqrt(country[casesType])*casesTypeColors[casesType].multplier}
        >
            <Popup>
                <div className='info-container'>
                    <div className='info-flag' style={{backgroundImage:`url(${country.countryInfo.flag})`}}/>
                    <div className='info-name'>{country.country}</div>
                    <div className='info-confirmed'>Cases:{numeral(country.cases).format("0,0")}</div>
                    <div className='info-recovered'>Recovered:{numeral(country.recovered).format("0,0")}</div>
                    <div className='info-deaths'>Deaths:{numeral(country.deaths).format("0,0")}</div>

                </div>
            </Popup>
        </Circle>
    ));