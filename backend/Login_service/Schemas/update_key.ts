// this is to use it to update the database with the new passkey
// this will be used to update the passkey (approved or temporary) in the database user
// functions that will call need this schema:
// - update secret or temp secret in the database
// - delete secret or temp secret from the database (based on a time frame or user request)
// 
export interface updatePassKeyForm {
    id: number;
    passKey: string | null;
}