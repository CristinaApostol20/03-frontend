import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  searchMode: boolean;

  constructor(private productService: ProductService,
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

    //acum cautam produsul folosind keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        console.log(data);
        this.products = data;
      }
    )
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

    //luam produsele din categoria data
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        console.log(data);
        this.products = data;
      }
    )
  }
}
