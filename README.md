# Sardis DevOps Project

## Setup Dev Environment:

I am using an Ubuntu and VS Code. Following tools will be required for this project:

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

## 2. Set Up a GKE cluster

lauch the dev environemt container:
```
podman exec -it bash bash
```

connect gcloud cli to GCP account and create a new project: 
```
gcloud auth login --no-launch-browser
# follow the instructions ...

gcloud projects create sardis-240227 --name="sardis"
gcloud config set project sardis-240227
```

( Link billing account of not linked with the project:
gcloud beta billing projects link Project-ID --billing-account=xxxxxx-yyyyyy-xxxxxx)

create a cluster:
```
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud container clusters create sardis \
    --num-nodes=1 \
    --machine-type=e2-small \
    --zone=us-central1-a \
    --cluster-version latest
```

## Status

Working on GKE Cluster