import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import * as Query from './query'; //to import everything from file

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-graph';
  formCreateElement: FormGroup;
  products:any = [];

  id: String;
  isUpdate: Boolean = false;

  constructor (private apollo:Apollo, private formBuilder : FormBuilder,){
    this.getProducts();
    this.formCreateElement = this.formBuilder.group({
      'name': ['', Validators.required],
      'description' : ['', Validators.required]
    })
  }

  getProducts(){
    this.apollo.watchQuery({ query: Query.Products }).valueChanges.subscribe(response =>{
      //console.log(response);
      this.products = response.data['products'];
    });
  }

  createNew(){
    this.apollo.mutate({
      mutation: Query.createProduct,
      variables: {
        name: this.formCreateElement.get('name').value,
        description: this.formCreateElement.get('description').value
      },
      update: (proxy, { data: { createProduct } }) => {
        const data: any = proxy.readQuery({ query:Query.Products }); //lee la caché de apollo

        //console.log(data.products, createProduct);
        this.products.push(createProduct); //añade elemento
        proxy.writeQuery( { query: Query.Products, data }); //actualiza caché de apollo
        
        //resetea valores del formulario
        this.formCreateElement.get('name').setValue('');
        this.formCreateElement.get('description').setValue('');
      }
    }).subscribe(({ data }) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  setUpdate(product: any){
    this.isUpdate= true
    this.id = product.id;
    this.formCreateElement.get('name').setValue(product.name);
    this.formCreateElement.get('description').setValue(product.description);
  }

  updateElement(){
    this.apollo.mutate({
      mutation: Query.updateProduct,
      variables: {
        id: this.id,
        name: this.formCreateElement.get('name').value,
        description: this.formCreateElement.get('description').value
      },
      update: (proxy, { data: { updateProduct } }) => {
        const data: any = proxy.readQuery({ query:Query.Products });

        //console.log(data, createProduct);
        const foundIndex = this.products.findIndex( p => p.id === this.id);
        this.products[foundIndex] = updateProduct;
        this.formCreateElement.get('name').setValue('');
        this.formCreateElement.get('description').setValue('');
        this.isUpdate = false;
        proxy.writeQuery( { query: Query.Products, data }); //actualiza caché de apollo
      }
    }).subscribe(({ data }) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  cancelUpdate() {
    this.formCreateElement.get('name').setValue('');
    this.formCreateElement.get('description').setValue('');
    this.isUpdate = false;
  }

  delete(id: any) {
    this.apollo.mutate({
      mutation: Query.deleteProduct,
      variables: {
        id: id
      },
      update: (proxy, { data: { deleteProduct } }) => {
        const data: any = proxy.readQuery({ query:Query.Products });

        //console.log(data, createProduct);
        const foundIndex = this.products.findIndex( p => p.id === id);
        this.products.splice(foundIndex, 1);
        proxy.writeQuery( { query: Query.Products, data }); //actualiza caché de apollo
      }
    }).subscribe(({ data }) => {
      //console.log(data);
    }, (error) => {
      console.log(error);
    });
  }
}
