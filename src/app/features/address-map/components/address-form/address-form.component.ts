import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    OnInit,
    Output,
    signal,
    inject,
    DestroyRef,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, merge, map } from 'rxjs';
import {
    LocationCountry,
    LocationState,
    LocationCity,
    LocationService,
} from '../../services/location.service';

export interface UserAddress {
    country: string;
    streetAddress: string;
    addressLine2?: string;
    city: string;
    stateProvince: string;
    postalCode: string;
}

export interface AddressFormControls {
    country: FormControl<string>;
    streetAddress: FormControl<string>;
    addressLine2: FormControl<string>;
    city: FormControl<string>;
    stateProvince: FormControl<string>;
    postalCode: FormControl<string>;
}

export type AddressForm = FormGroup<AddressFormControls>;

@Component({
    selector: 'app-address-form',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
    ],
    templateUrl: './address-form.component.html',
    styleUrl: './address-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent implements OnInit {
    @Output() readonly addressChanged = new EventEmitter<UserAddress>();
    @Output() readonly generateQrCode = new EventEmitter<UserAddress>();

    public addressForm!: AddressForm;
    public readonly isGeneratingQrCode = signal(false);

    public countries: LocationCountry[] = [];
    public states: LocationState[] = [];
    public cities: LocationCity[] = [];

    private readonly fb = inject(FormBuilder);
    private readonly destroyRef = inject(DestroyRef);
    private readonly locationService = inject(LocationService);

    public ngOnInit(): void {
        this.initializeLocationData();
        this.buildForm();
        this.subscribeToAddressChanges();
        this.subscribeToLocationChanges();
    }

    public get countryControl(): FormControl<string> {
        return this.addressForm.controls.country;
    }

    public get streetAddressControl(): FormControl<string> {
        return this.addressForm.controls.streetAddress;
    }

    public get addressLine2Control(): FormControl<string> {
        return this.addressForm.controls.addressLine2;
    }

    public get cityControl(): FormControl<string> {
        return this.addressForm.controls.city;
    }

    public get stateProvinceControl(): FormControl<string> {
        return this.addressForm.controls.stateProvince;
    }

    public get postalCodeControl(): FormControl<string> {
        return this.addressForm.controls.postalCode;
    }

    private initializeLocationData(): void {
        this.countries = this.locationService.getSupportedCountries();

        const firstCountry = this.countries[0];
        if (firstCountry) {
            this.states = this.locationService.getStatesByCountry(firstCountry.code);
        }
    }

    private buildForm(): void {
        const defaultCountryCode = this.countries[0]?.code || '';

        this.addressForm = this.fb.group<AddressFormControls>({
            country: this.fb.control(defaultCountryCode, {
                nonNullable: true,
                validators: [Validators.required],
            }),
            streetAddress: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(5)],
            }),
            addressLine2: this.fb.control('', {
                nonNullable: true,
                validators: [],
            }),
            city: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            stateProvince: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            postalCode: this.fb.control('', {
                nonNullable: true,
                validators: [Validators.required, Validators.pattern(/^[A-Z0-9\s-]{3,10}$/i)],
            }),
        });
    }

    private subscribeToAddressChanges(): void {
        this.addressForm.valueChanges
            .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
            .subscribe(formValue => {
                if (formValue.country && formValue.city && formValue.stateProvince) {
                    const userAddress: UserAddress = {
                        country: formValue.country,
                        streetAddress: formValue.streetAddress?.trim() || '',
                        addressLine2: formValue.addressLine2?.trim() || undefined,
                        city: formValue.city.trim(),
                        stateProvince: formValue.stateProvince.trim(),
                        postalCode: formValue.postalCode?.trim() || '',
                    };

                    this.addressChanged.emit(userAddress);
                }
            });
    }

    private subscribeToLocationChanges(): void {
        merge(
            this.addressForm
                .get('country')!
                .valueChanges.pipe(
                    map((countryCode: string) => ({ type: 'country' as const, value: countryCode }))
                ),
            this.addressForm
                .get('stateProvince')!
                .valueChanges.pipe(
                    map((stateCode: string) => ({ type: 'state' as const, value: stateCode }))
                )
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ type, value }) => {
                switch (type) {
                    case 'country':
                        this.onCountryChange(value);
                        break;
                    case 'state':
                        this.onStateChange(value);
                        break;
                }
            });
    }

    private onCountryChange(countryCode: string): void {
        this.states = this.locationService.getStatesByCountry(countryCode);
        this.cities = [];

        this.addressForm.patchValue(
            {
                stateProvince: '',
                city: '',
            },
            { emitEvent: false }
        );
    }

    private onStateChange(stateCode: string): void {
        const countryCode = this.addressForm.value.country;
        if (!stateCode || !countryCode) {
            this.cities = [];
            return;
        }

        this.cities = this.locationService.getCitiesByState(countryCode, stateCode);

        this.addressForm.patchValue(
            {
                city: '',
            },
            { emitEvent: false }
        );
    }
    public onGenerateQrCode(): void {
        if (this.addressForm.valid) {
            this.isGeneratingQrCode.set(true);
            const userAddress: UserAddress = this.getCurrentAddressValue();

            this.generateQrCode.emit(userAddress);

            setTimeout(() => this.isGeneratingQrCode.set(false), 1000);
        } else {
            this.addressForm.markAllAsTouched();
        }
    }
    private getCurrentAddressValue(): UserAddress {
        const formValue = this.addressForm.getRawValue();
        return {
            country: formValue.country,
            streetAddress: formValue.streetAddress.trim(),
            addressLine2: formValue.addressLine2?.trim() || undefined,
            city: formValue.city.trim(),
            stateProvince: formValue.stateProvince.trim(),
            postalCode: formValue.postalCode.trim(),
        };
    }
}
