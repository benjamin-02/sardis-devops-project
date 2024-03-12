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


## 2. Set Up a GKE cluster

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
gcloud container clusters create sardis-dev \
    --num-nodes=1 \
    --machine-type=e2-small \
    --zone=us-central1-a \
    --disk-type=pd-standard \
    --disk-size=50 \
    --cluster-version latest
```

## 3. Deploy the hello world app on GKE

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


## 4. Develop a quote generator web app and deploy it on GKE
Web application: JS, HTML, CSS (nodejs)
Backed: python, flask
Postman / curl
	- Containerize the app (Two Dockerfiles) ->  (test locally with 2 container). 
	- Write Kubernetes YAML files for deploying the application to the GKE

### Deploy manually to GKE

login to dev env: `podman exec -it dev bash`

first the backend deployment and backend service:
```
git clone https://github.com/benjamin-02/sardis-devops-project.git && cd sardis-devops-project/back_end
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
then, inside the cluster, the URL (with the service name):  http://sardis-be-svc:5000/quote should reutrn a quote.
so we will call this URL from our front end.

now the frontend deployment and the frontend service:
```
cd sardis-devops-project/front_end
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
with `kubectl get service sardis-fe-svc` the External IP address of this loadbalancer service should be printed and using this IP 
http://EXTERNAL-IP
the quote generator application can be used. (since the front end service runs on port 80 there is no need to specify port number in the URL.)
  



## 5. Implement CICD Using Github Actions
	- Implement basic CI/CD using GitHub Actions
        - Build Docker images
        - Deploy to GKE
	    - Test the pipeline
	    - seperate deployment for the dev branch [second cluster for beta]

### Create Secrets for Docker Hub
Login to docker hub, then:
Click on profile picture > My Account
Security (on the left) > Acess Tokens > New Access Token

give a name to the token, give read and write permissions to the token and generate it!

The token is visible only at this point and after copy and close it wont be shown again. copy it, we will paste it to the github secrets. 

Now go to github repo settings > Security, Secrets and variables (on the left panel)  > Actions  > New Repository Secret

give the secret a name: `DOCKER_HUB_ACCESS_TOKEN` and paste the token from docker hub to the secret field and click on add secret button.

we will need to create another secret. for that again, same procedure. secret name: `DOCKER_HUB_USERNAME` and the username in the secret field. 

this is the block we will need in the `.github/workflows/ci-cd.yaml` file to login to dockerhub: 
```
jobs: 
  pushonmain: 
    runs-on: ubuntu-latest 
    steps: 
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}
```

following block helps building pushing the image to docker hub to the given repo name:
```
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
            context: front_end
            push: true
            tags: ${{ secrets.DOCKER_HUB_USERNAME }}/sardis-fe:latest, ${{ secrets.DOCKER_HUB_USERNAME }}/sardis-fe:${{ github.run_number }}
```

and this part makes sure, if there is a change on main branch in the front_end directory, the ci pipeline will run:
```
on: 
  push: 
    branches: 
      - main
    paths:
      - 'front_end/**'
```




### Implement CD Pipeline

There are some prerequisites for this step i.e. Google Service Account and and storing its keys as Github Secret.

Creating the project and cluster was already done in the previous steps. In a production Apllication, this can be done with a bootstrap script. 

we will only do the deployment process of the application here in this step, not the deployment of the infrastructure. 

But the service account etc. can be implemented in the bootstrapping script too. 

login to the dev container and:
```
# Assign the project name and the service account name to the corresponding variables
GKE_PROJECT=sardis-240227
SA_NAME=sardis-service-account

# Create Service Account
gcloud iam service-accounts create $SA_NAME

# Add roles
gcloud iam service-accounts list
SA_EMAIL=$(gcloud iam service-accounts list | grep $SA_NAME | awk -F' ' '{ print $1 }')
gcloud projects add-iam-policy-binding $GKE_PROJECT \
  --member=serviceAccount:$SA_EMAIL \
  --role=roles/container.admin
<!-- gcloud projects add-iam-policy-binding $GKE_PROJECT \
  --member=serviceAccount:$SA_EMAIL \
  --role=roles/storage.admin
gcloud projects add-iam-policy-binding $GKE_PROJECT \
  --member=serviceAccount:$SA_EMAIL \
  --role=roles/container.clusterViewer -->

# Download the JSON keyfile for the service account:
gcloud iam service-accounts keys create key.json --iam-account=$SA_EMAIL

# show the key
cat key.json | base64 -w 0
# and copy it
# now we can delete it 
rm -f key.json
```

create a new repository secret in github secrets, named `GKE_SA_KEY` and paste the key as the value of it




## docker images:
backend:
docker.io/benjamindckr/sardis-be:latest

front end:
docker.io/benjamindckr/sardis-fe:latest

dev container:
docker.io/benjamindckr/sardis-dev-ctnr:latest

hello world app:
docker.io/benjamindckr/sardis:latest


## Status

Working on 5. Task
