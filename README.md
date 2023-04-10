# Flair-Real-Estate
A project to build Flair Real Estate an innovative and interactive platform. This will be designed to serve business-to-business consumers looking to enter the new housing development market in Australia

# get all users 
/api/users/

input: NA

output: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

Errors:
404 user not found/invaild id 

# get a single user
/api/users/_id

input: _id

output: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

Errors:
404 user not found/invaild id 

# create a user
/api/users/

input: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

output: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

Errors:
404 cannot create user

# login a user
/api/users/_email

input:{
    email:
    password:
}

output: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

error: 404 emmail not found/incorrect password

# update a user
/api/users/_id

input: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

output: {
    _id:
    firstName:
    lastName:
    phoneNo:
    email:
    password:
}

Errors:
404 user not found/invaild id 

