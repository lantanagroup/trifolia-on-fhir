
export interface ITofUser {
  sub: string;
  email?: string;
  name?: string;
  isAdmin: boolean;   // set by ToF
}

/*
For auth0.com:

{
  "email": "XXXXX",
  "picture": "XXXXX",
  "nickname": "XXXXX",
  "name": "XXXXX",
  "app_metadata": {},
  "roles": [
    "admin"
  ],
  "email_verified": true,
  "clientID": "XXXXX",
  "user_id": "auth0|XXXXX",
  "identities": [
    {
      "user_id": "XXXXX",
      "provider": "auth0",
      "connection": "Username-Password-Authentication",
      "isSocial": false
    }
  ],
  "updated_at": "2019-12-03T21:58:24.287Z",
  "created_at": "2016-09-27T15:42:52.173Z",
  "iss": "https://XXXXX.auth0.com/",
  "sub": "auth0|XXXXX",
  "aud": "XXXXX",
  "iat": 1575410305,
  "exp": 1575446305,
  "at_hash": "XXXXX",
  "nonce": "XXXXX"
}
 */

/*
For KeyCloak:

{
  "jti": "XXXXX",
  "exp": 1575421542,
  "nbf": 0,
  "iat": 1575420642,
  "iss": "http://localhost:8081/auth/realms/tof",
  "aud": "tof-app",
  "sub": "XXXXX",
  "typ": "ID",
  "azp": "tof-app",
  "nonce": "XXXXX",
  "auth_time": 1575420642,
  "session_state": "XXXXX",
  "at_hash": "XXXXX",
  "acr": "1",
  "s_hash": "XXXXX",
  "email_verified": false,
  "roles": [
    "manage-account",
    "manage-account-links",
    "view-profile",
    "admin"
  ],
  "name": "XXXXX",
  "preferred_username": "XXXXX",
  "given_name": "XXXXX",
  "family_name": "XXXXX",
  "email": "XXXXX"
}
 */
