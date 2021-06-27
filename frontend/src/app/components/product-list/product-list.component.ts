import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number = 1;
  currentCategoryName: string = 'Books';
  previousCategoryId: number = 1;
  
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService, private route: ActivatedRoute) {
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has("keyword");

    if (this.searchMode) {

      this.handleSearchProduct();

    } else {

      this.handleListProduct();  

    }

  }

  handleListProduct() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id");
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
      this.previousCategoryId = this.currentCategoryId;
    }


    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                              this.thePageSize, 
                                              this.currentCategoryId)
                                              .subscribe(this.processResult());
    
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  handleSearchProduct() {
    
    const keyword: string = this.route.snapshot.paramMap.get("keyword");
    
    // if we have a different keyword than previous
    // then set thePageNumber to 1
    if (this.previousKeyword != keyword) {
      this.previousKeyword = keyword;
      this.thePageNumber = 1;
    }

    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1, 
                                                  this.thePageSize, 
                                                  keyword)
                                                  .subscribe(this.processResult())
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
}
