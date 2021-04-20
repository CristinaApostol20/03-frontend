import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {
    //validarea spatiului alb
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        //verificam daca stringul are numai spatiu alb
        if ((control.value != null) && (control.value.trim().length === 0)) {
            //daca e invalid, returneaza un obiect eroare
            return { 'notOnlyWhitespace': true };
        } else {
            //daca e valid, returneaza null
            return null;
        }
    }
}
