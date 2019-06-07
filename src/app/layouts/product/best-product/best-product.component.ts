import { TranslateService } from 'src/app/shared/services/translate.service';
import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
declare let Client;
@Component({
	selector: 'app-best-product',
	templateUrl: './best-product.component.html',
	styleUrls: [ './best-product.component.scss' ]
})
export class BestProductComponent implements OnInit {
	bestProducts: Product[] = [];
	options: any;
	loading = false;
	constructor(
		private productService: ProductService,
		private toasterService: ToastrService,
		public translate: TranslateService,
    private router: Router,
    private app: ApplicationRef,
    private http: HttpClient
	) {
    window['Controller'] = this;
  }

	ngOnInit() {
		this.options = {
			dots: false,
			responsive: {
				'0': { items: 1, margin: 5 },
				'430': { items: 2, margin: 5 },
				'550': { items: 3, margin: 5 },
				'670': { items: 4, margin: 5 }
			},
			autoplay: true,
			loop: true,
			autoplayTimeout: 3000,
			lazyLoad: true
		};
		this.getAllProducts();
	}

	productLookup(name){
    for(const val of this.bestProducts){
      if(val.productName.toLowerCase() == name.toLowerCase()){
        Client.newEventSession(Window["sessionID"]);
        Client.track("view-product", JSON.stringify(val));
        // this.http.post('https://api.reveldigital.com/api/devices/'+'4rdJw8N0r3Oso3SBsX2dbQ'+'/track?api_key=ZkgKeTifhhorIddmsChryA', {
        //   "session_id": Window["sessionID"],
        //   "event_name": "view-product",
        //   "properties": val
        // }).subscribe(()=>{
        //
        // });
        this.router.navigate(['/products/product', val.$key]).then( (e) => {
          if (e) {
            this.app.tick();
            console.log("Navigation is successful!");
          } else {
            console.log("Navigation has failed!");
          }
        });
        break;
      }
    }
  }

	getAllProducts() {
		this.loading = true;
		const x = this.productService.getProducts();
		x.snapshotChanges().subscribe(
			(product) => {
				this.loading = false;
				this.bestProducts = [];
				for (let i = 0; i < 5; i++) {
					const y = product[i].payload.toJSON();
					y['$key'] = product[i].key;
					this.bestProducts.push(y as Product);
				}
				// product.forEach(element => {
				//   const y = element.payload.toJSON();
				//   y["$key"] = element.key;
				//   this.bestProducts.push(y as Product);
				// });
			},
			(error) => {
				this.toasterService.error('Error while fetching Products', error);
			}
		);
	}
}
