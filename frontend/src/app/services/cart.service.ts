import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let existingCartItem: CartItem = undefined;

    // find the item in the cart based on item id
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

    // check if we found it 
    if (existingCartItem) {
      // increment the quantity
      existingCartItem.quantity++;
    }  else {
      // just add the item to the array
      this.cartItems.push(theCartItem) 
    }

    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

  }

}
