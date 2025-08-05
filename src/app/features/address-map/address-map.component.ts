import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    AddressFormComponent,
    UserAddress,
} from './components/address-form/address-form/address-form.component';
import { GoogleMapComponent } from './components/google-map/google-map/google-map.component';

@Component({
    selector: 'app-address-map',
    imports: [MatCardModule, AddressFormComponent, GoogleMapComponent],
    templateUrl: './address-map.component.html',
    styleUrl: './address-map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressMapComponent {
    private snackBar = inject(MatSnackBar);
    public currentAddress = signal<UserAddress | null>(null);

    public onGenerateQrCode(address: UserAddress) {
        this.snackBar.open('QR Code generated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

    public onAddressChanged(address: UserAddress) {
        this.currentAddress.set(address);
    }
}
