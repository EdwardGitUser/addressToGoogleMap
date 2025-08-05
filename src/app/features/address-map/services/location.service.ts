import { Injectable } from '@angular/core';
import { Country, State, City, ICity, IState, ICountry } from 'country-state-city';

export interface LocationCountry {
    code: string;
    name: string;
    flag: string;
}

export interface LocationState {
    code: string;
    name: string;
    countryCode: string;
}

export interface LocationCity {
    name: string;
    stateCode: string;
    countryCode: string;
    latitude?: string | null;
    longitude?: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private readonly supportedCountries = ['UA'];

    // GET ALL COUNTRIES
    public getSupportedCountries(): LocationCountry[] {
        const allCountries: ICountry[] = Country.getAllCountries();

        return allCountries
            .filter(country => this.supportedCountries.includes(country.isoCode))
            .map(country => ({
                code: country.isoCode,
                name: country.name,
                flag: country.flag,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    // GET STATES BY COUNTRY
    public getStatesByCountry(countryCode: string): LocationState[] {
        if (!this.supportedCountries.includes(countryCode)) {
            console.warn(`Country ${countryCode} is not supported`);
            return [];
        }

        const states: IState[] = State.getStatesOfCountry(countryCode);

        return states
            .map(state => ({
                code: state.isoCode,
                name: state.name,
                countryCode: state.countryCode,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    // GET CITIES BY STATE
    public getCitiesByState(countryCode: string, stateCode: string): LocationCity[] {
        if (!this.supportedCountries.includes(countryCode)) {
            console.warn(`Country ${countryCode} is not supported`);
            return [];
        }

        const cities: ICity[] = City.getCitiesOfState(countryCode, stateCode);

        return cities
            .map(city => ({
                name: city.name,
                stateCode: city.stateCode,
                countryCode: city.countryCode,
                latitude: city.latitude || undefined,
                longitude: city.longitude || undefined,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // GET ALL CITIES BY COUNTRY
    public getAllCitiesByCountry(countryCode: string): LocationCity[] {
        if (!this.supportedCountries.includes(countryCode)) {
            console.warn(`Country ${countryCode} is not supported`);
            return [];
        }

        const states: LocationState[] = this.getStatesByCountry(countryCode);
        const allCities: LocationCity[] = [];

        states.forEach(state => {
            const cities: LocationCity[] = this.getCitiesByState(countryCode, state.code);
            allCities.push(...cities);
        });

        return allCities
            .filter(
                (city, index, self) =>
                    index ===
                    self.findIndex(c => c.name === city.name && c.countryCode === city.countryCode)
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    // GET COUNTRY BY CODE
    public getCountryByCode(countryCode: string): LocationCountry | null {
        const countries: LocationCountry[] = this.getSupportedCountries();
        return countries.find(country => country.code === countryCode) || null;
    }

    // GET STATE BY CODE
    public getStateByCode(countryCode: string, stateCode: string): LocationState | null {
        const states: LocationState[] = this.getStatesByCountry(countryCode);
        return states.find(state => state.code === stateCode) || null;
    }

    // CHECK IF COUNTRY IS SUPPORTED
    public isCountrySupported(countryCode: string): boolean {
        return this.supportedCountries.includes(countryCode);
    }
}
