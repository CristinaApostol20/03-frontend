import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //pentru paginatie
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;
  

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { } //injectam activated route, pentru a accesa parametri rutei

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if(this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //acum cautam produsul folosind keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {

    //verifica daca parametrul "id" este valabil
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if (hasCategoryId) {
      //ia param id ca string, il transforma in numar prin folosirea "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      //daca nu este valabila categoria, sa ia categoria implicita
      this.currentCategoryId = 1;
    }

    //verificam daca avem o categorie diferita fata de cea anterioara

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);



    //luam produsele din categoria data
    //paginatia in angular e bazata pe 1, paginatia in spring data rest e bazata pe 0
    //trebuie sa scadem 1 ca sa se potriveasca cu backendul
    this.productService.getProductListPaginate(this.thePageNumber-1, 
                                     this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
    
    
  }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number +1; //ca sa se potriveasca cu backendul
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts(); //ca sa reincarce pagina cu produsele
  }

  addToCart(theProduct: Product) {
    console.log(`Adaugat in cos: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
