# SENG 513 Winter 2025 Final Project

## Group 1
Quinn Leonard (30145315)
Andy Tang (10139121)
Jordan Tewnion (30151170)
Efren Garcia (30146181)
Imran Haji (30141571)

## The Memory

The Memory is a service for creating and sharing collaborative locationally tagged photo galleries.

It offers the ability to create photo galleries tied to real-world locations that can be edited by other users that are added as collaborators.

Mark a gallery as public and share the link with your friends and family so that they can view your galleries regardless of whether they have an account.

## Running The Memory

The Memory's server and database are being hosted through Azure and as such are already deployed and don't need to be run locally.

For running The Memory's client, a Dockerfile has been provided. To use it, first run the Docker Desktop application, then navigate to the Memory_Client directory and run the following commands:

``` 
docker build -t memory_client .
docker run -p 3000:3000 memory_client
```

This should respond with some Node Package Manager messages, and the app can then be accessed at localhost:3000