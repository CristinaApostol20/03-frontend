import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject <number> = new BehaviorSubject<number>(0); //behaviorsubject  publica ulimul eveniment in cod
  totalQuantity: Subject <number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage; //datele raman si dupa ce inchid browserul

  constructor() { 
    //citim datele din storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if( data!= null) {
      this.cartItems = data;

      //calculam totalul pe baza dateleor din storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    //verificam mai intai daca avem produsul in cos
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0) {
    //gasim produsul in cos pe baza item id

    
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

    //verificam daca l-am gasit
    alreadyExistsInCart = (existingCartItem != undefined);

    }

    if (alreadyExistsInCart) {
      //marim cantitatea
      existingCartItem.quantity++;
  
    } else {
      //adauga produsul in array
      this.cartItems.push(theCartItem);
    }

    //facem totatul cosului la pret si cantitate
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //.next publica noile valori si toti subscriberii primesc noile valori
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    this.persistCartItems();
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Cosul contine`);
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);

    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`); //toFixed imi arata doar 2 zecimale
    console.log(`-------`);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);

    } else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {

    //cer indexul produsului in array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    //daca il gasesc, il sterg
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); //cheie + valoare
  }
}
