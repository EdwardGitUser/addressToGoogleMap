import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddressMapComponent } from './features/address-map/address-map.component';

@Component({
    selector: 'app-root',
    imports: [AddressMapComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
