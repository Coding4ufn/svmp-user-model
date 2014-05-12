# svmp-user-model

  User Model for SVMP proxy and Web console


## Example

```js
// require the module
var ProxyUser = require('svmp-user-model');

// Static: List all Users. Returns a promise
ProxyUser.listAllUsers()
    .then(function(results) {
       console.log("The users: ", results);
    }, function(err) {
       console.log("Error: ", err);
    });;

// Static: List all approved Users
ProxyUser.listApprovedUsers().then(...);

// Static: List all pending Users
ProxyUser.listPendingUsers().then(...);

// Static: Find a user by username
ProxyUser.findUser(username).then(...);

// Instance method: get the user's role
user.getRole();
// => 'user'

// Instance method: does the user have admin privleges
user.isAdmin();
// => true

// Instance method: authenticate the user's password
user.authenticate(password);
// => true
```

## License

Copyright (c) 2012-2013, The MITRE Corporation, All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

