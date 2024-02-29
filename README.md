# Sardis DevOps Project

## Setup Dev Environment:

I am using an Ubuntu and VS Code. Following tools will be required for this project:

- docker/podman: for building the Dockerfile and testing image locally
- gcloud CLI: for creating GKE environment
- kubectl: for managing GKE cluster
- python & flask

### gcloud CLI & kubectl
For Ubuntu 22.04:
```
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates gnupg curl sudo -y
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli
sudo apt-get install google-cloud-sdk-gke-gcloud-auth-plugin kubectl
```

Here is the official documentation for other ubuntu versions/distros as well:
https://cloud.google.com/sdk/docs/install#installation_instructions


# Tasks

## 1. Write a dockerized Hello World App and deploy locally: 

Run:
```
podman run -d -p 8080:80  benjamindckr/sardis:latest
```
launch it with:
http://localhost:8080


## 2. Set Up a GKE cluster and deploy the app on GKE

lauch the dev environemt container:
```
#podman run --name bash -d -it ubuntu
#podman exec -it bash bash

podman run --name dev -d -it benjamindckr/sardis-dev-ctnr
podman exec -it dev bash
```

from the cdev container, connect gcloud cli to GCP account and create a new project: 
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

clone the repo and deploy the app as a k8s deployment and service on GKE
```
git clone https://github.com/benjamin-02/sardis-devops-project.git && cd sardis-devops-project/hello_world_service
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
sleep 60 # it takes some time for gcp to attach external IP to the service
kubectl get service sardis-svc
```

copy the external ip from the output of the command above.
launch the app with:
http://<EXTERNAL_IP>:8080 


( to delete the cluster: `gcloud container clusters delete sardis --location us-central1-a` )


## 3. Develop a quote generator web app and deploy it on GKE
Web application: JS, HTML, CSS (nodejs)
Backed: python, flask
Postman / curl
	- Containerize the app (Two Dockerfiles) ->  (test locally with 2 container). 
	- Write Kubernetes YAML files for deploying the application to the GKE





## Status

Working on 3. Task