# Sardis DevOps Project

## Setup Dev Environment:

I am using an Ubuntu shell and VS Code. Following tools will be required for this project:

- gclod CLI: for creating GKE environment
- kubectl: for managing GKE cluster
- docker/podman: for building the Dockerfile and testing image locally
- python & flask


### podman



### gcloud CLI & kubectl
For Ubuntu 22.04:
```
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates gnupg curl sudo -y
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli
sudo apt-get install kubectl
```

Here is the official documentation for other ubuntu versions/distros as well:
https://cloud.google.com/sdk/docs/install#installation_instructions


# Tasks

## 1. Dockerized Hello World App

Write the Dockerfile and build it from local termianl:
```
podman build -t benjamindckr/sardis:v1 .
podman login docker.io
podman push docker.io/benjamindckr/sardis:v1
```
Run:
```
podman run -d -p 8080:80  benjamindckr/sardis:v1
```

## 




## Deployment

```
podman 
```

## Status

