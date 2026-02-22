NOTE: 
- whenever there is a question mark ?, it means it is optional and you could send/receive a request/response without.
- There are more security layers that could be added to the code.
- Let us not complicate life more than it already is xD
- Considering the previous life concept, for error handling, let us make
a generic frontend error handling for all cases. "Error ! and a sad face"

find . -name "*.js" -type f -not -path "./node_modules/*"
find . -name "*.js" -type f -not -path "./node_modules/*" -delete
------------------  Create User Route --------------------
This is used to add a new user to the database.
Route: http://localhost:8080/createUser
Type: POST
Request: 
createUserData {
        username: string;
        email?: string;
        password: string;
}
Response:
creationResponse {
    success: boolean; (true is ok, false is not ok)
    message: string;
    user?: {
        id: number;
        email?: string;
        username: string;
    } (user shall never be there for security. debug only. I did not do a cleanup though)
}
------------------  Create User Route --------------------

------------------  Login Route --------------------------
This login will always check if 2FA activated, it goes on normally if
2FA is not activated. Does cleanup in case the enabling of 2FA was 
terminated without being completed. and in case of 2FA is on, it will
request a TOTP from the frontend in a message then terminate the callback.

Route: http://localhost:8080/login
Type: POST
Request:
logingAttempt {
    username: string;
    email?: string;
    password: string;
}

Response:
serverResponse {
    success: boolean;
    message: string;
}
------------------  Login Route --------------------------

------------------  Login Verify Route -------------------
This should be called by the frontend only when it gets back from the server that a TOTP required for login.
if that is what the frontend gets, it should prompt the user to insert 6 numbers, and send it using this Route
to the backend. in this call it should receive either success login, or wrong code.
ٍRoute: http://localhost:8080/login/verify
Type: POST
Request:
updatePassKeyForm {
    id: number;
    passKey: string | null;
}
Response:
serverResponse {
    success: boolean;
    message: string;
}
------------------  Login Verify Route -------------------

------------------  Update User Route --------------------
This is to update the user data, such as username, password, email.
but to do this, it is obligatory to ask the user to insert his password before any change.
you can edit many things in the same go. but it is better to accept only one edit each time
as a better practise.
Route: http://localhost:8080/updateUser
Type: PUT
Request:
updateForm {
    id: number;
    password: string;
    username?: string;
    email?: string;
    newpassword?: string;
}
Response:
serverResponse {
    success: boolean;
    message: string;
}
------------------  Update User Route --------------------

------------------  Delete User Route --------------------
Remove User from Database
Route: http://localhost:8080/deleteUser
Type: POST
Request:
deleteForm {
    id: number;
    password: string;
}
Response:
serverResponse {
    success: boolean;
    message: string;
}
------------------  Delete User Route --------------------

------------------  Enable 2FA Route ---------------------
Enable the 2FA option phase 1. Inside the serverResponse.url there is the QR Code.
to be screened on the browser and scanned. here it ends the phase 1.
Route: http://localhost:8080/enable2FA
Type: POST
Request:
update2FAStatus {
    id: number;
    enabled: number;
}
Response:
serverResponse {
    success: boolean;
    message: string;
    url?: string | null;
}
------------------  Enable 2FA Route ---------------------

------------------  Verify 2FA Route ---------------------
Here is the phase 2. The user insert the 6 digits received from his authenticator.
The Frontend send it to the backend for verification.
Route: http://localhost:8080/enable2FA/verify
Type: POST
Request:
updatePassKeyForm {
    id: number;
    passKey: string | null;
}
Response:
serverResponse {
    success: boolean;
    message: string;
}
------------------  Verify 2FA Route ---------------------