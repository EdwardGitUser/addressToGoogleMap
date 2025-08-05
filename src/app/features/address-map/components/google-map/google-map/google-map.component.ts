import {
    ChangeDetectionStrategy,
    Component,
    input,
    effect,
    signal,
    ViewChild,
    ElementRef,
    AfterViewInit,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { UserAddress } from '../../address-form/address-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const DEFAULT_MAP_CENTER: google.maps.LatLngLiteral = { lat: 50.4501, lng: 30.5234 };
const DEFAULT_MAP_ZOOM = 12;

@Component({
    selector: 'app-google-map',
    imports: [GoogleMapsModule, MatIconModule, MatButtonModule],
    templateUrl: './google-map.component.html',
    styleUrl: './google-map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleMapComponent {
    @ViewChild('autocompleteInput') autocompleteInput!: ElementRef<HTMLInputElement>;

    public readonly address = input<UserAddress | null>(null);

    public readonly center = signal(DEFAULT_MAP_CENTER);
    public readonly zoom = signal(DEFAULT_MAP_ZOOM);
    public readonly mapOptions = signal<google.maps.MapOptions>({
        mapId: 'DEMO_MAP_ID',
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        maxZoom: 20,
        minZoom: 4,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_LEFT,
        },
    });

    public readonly selectedPlace = signal<google.maps.LatLngLiteral | null>(null);
    public readonly markerOptions = signal<google.maps.marker.AdvancedMarkerElementOptions>({
        gmpDraggable: false,
    });

    private readonly geocoder = new google.maps.Geocoder();
    private map?: google.maps.Map;

    constructor() {
        effect(() => {
            const currentAddress: UserAddress | null = this.address();
            if (currentAddress) {
                this.updateMapLocation(currentAddress);
            }
        });
    }

    public onMapInitialized(map: google.maps.Map): void {
        this.map = map;
        this.initializeAutocomplete();
    }

    public onPlaceSelected(place: any): void {
        if (place.geometry && place.geometry.location) {
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };

            this.center.set(location);
            this.selectedPlace.set(location);
        }
    }

    public clearAutocompleteInput(): void {
        if (this.autocompleteInput) {
            this.autocompleteInput.nativeElement.value = '';
            this.selectedPlace.set(null);
        }
    }

    private updateMapLocation(address: UserAddress): void {
        const simpleAddress: string = this.buildSimpleAddress(address);

        this.geocoder.geocode({ address: simpleAddress }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location: google.maps.LatLngLiteral = results[0].geometry.location.toJSON();
                const newCenter = {
                    lat: location.lat,
                    lng: location.lng,
                };
                this.center.set(newCenter);
            }
        });
    }

    private buildSimpleAddress(address: UserAddress): string {
        return [address.city.trim(), address.stateProvince.trim(), address.country.trim()].join(
            ', '
        );
    }

    private async initializeAutocomplete(): Promise<void> {
        try {
            const { Autocomplete } = (await google.maps.importLibrary(
                'places'
            )) as google.maps.PlacesLibrary;

            const autocompleteOptions = {
                fields: ['place_id', 'geometry', 'name', 'formatted_address'],
            };

            const autocomplete = new google.maps.places.Autocomplete(
                this.autocompleteInput.nativeElement,
                autocompleteOptions
            );

            autocomplete.bindTo('bounds', this.map!);

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (place.geometry && place.geometry.location) {
                    const location = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    };

                    this.center.set(location);
                    this.selectedPlace.set(location);

                    if (this.map) {
                        if (place.geometry.viewport) {
                            this.map.fitBounds(place.geometry.viewport);
                        } else {
                            this.map.setCenter(location);
                            this.map.setZoom(15);
                        }
                    }
                }
            });
        } catch (error) {}
    }
}
