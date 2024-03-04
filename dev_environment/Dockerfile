FROM ubuntu
RUN apt-get update
RUN apt-get install git vim curl sudo bash-completion -y
RUN apt-get install apt-transport-https ca-certificates gnupg -y
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN apt-get update && sudo apt-get install google-cloud-cli google-cloud-sdk-gke-gcloud-auth-plugin kubectl -y