export class Messages {
  constructor(public bookId:string,
              public bookTitle:string,
              public sender:string,
              public receiver:string,
              public id?:string){
  }
}
