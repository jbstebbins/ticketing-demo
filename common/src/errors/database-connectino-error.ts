 import { CustomError } from "./custom-error";
 
 export class DatabaseConnectionError extends CustomError {
     statusCode = 500;
     reason = 'Error connecting to database';

     constructor() {
        super('Error Connecting to DB');

        //Only because of extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);

     }

     serializeErrors = () => {
         return [
             { message: this.reason }
         ]
     }


 }

