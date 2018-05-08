export class Book {
  constructor(public author:string,
              public price:number,
              public seller:string,
              public sold:boolean,
              public title:string,
              public imgUrl:string,
              public city:string,
              public id?:string,
              public isbn?:string,
              public time?:any){
  }
}
