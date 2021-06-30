import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private Luv2ShopFormService: Luv2ShopFormService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    this.Luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      (data) => (this.creditCardMonths = data)
    );

    // populate credit card years
    this.Luv2ShopFormService.getCreditCardYears().subscribe(
      (data) => (this.creditCardYears = data)
    );

    // populate countries
    this.Luv2ShopFormService.getCountries().subscribe(
      (data) => (this.countries = data)
    );
  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(this.checkoutFormGroup.get('customer').value.email);
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value
      );
      // this.checkoutFormGroup
      //   .get('billingAddress')
      //   .setValue(this.checkoutFormGroup.get('shippingAddress').value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    let startMonth: number = new Date().getMonth() + 1;

    if (
      Number(this.checkoutFormGroup.get('creditCard').value.expirationYear) !==
      new Date().getFullYear()
    ) {
      startMonth = 1;
    }

    this.Luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      (data) => (this.creditCardMonths = data)
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    this.Luv2ShopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else if (formGroupName === 'billingAddress') {
        this.billingAddressStates = data;
      }

      formGroup.get('state').setValue(data[0]);
    });
  }
}
