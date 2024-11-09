#/bin/bash

# Change the ownership some of the files
######################################
CURRENT_USER=$(eval "whoami")
CURRENT_GROUP=$(eval "id -gn")

# Source code location
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/app
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/bootstrap
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/config
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/lang
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/public
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/resources
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/routes

# Database migrations
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/database/migrations
sudo chown -R $CURRENT_USER:$CURRENT_GROUP source/database/factories

# Change ownership of the entire .git directory
sudo chown -R $CURRENT_USER:$CURRENT_GROUP .git

# Pull from the repository
######################################
eval $(ssh-agent)

#ssh-add /home/rozikin/.ssh/id_ed25519

######################################
# Build Image
######################################

# Show all command and variable value
set -x

# Load configuration from .env file
set -o allexport

# If .env not exist then use format.env
if [ -f deploy.env ]; then
	source deploy.env
else
	echo "Please populate the deploy.env file from deploy.env.format"
	exit
fi
set +o allexport

# Hide all command and variable value again
set +x

# Build image from Docker file with var $IMAGE_REPO_NAME and tag $IMAGE_TAG
# You can see it from .env configuration
sudo docker build --platform=linux/amd64 --pull --rm -f "$DOCKER_FILE" -t $IMAGE_REPO_NAME:$IMAGE_TAG "."

# Show all list of docker iamge
sudo docker image ls


# Deploy to swarm
sudo docker stack deploy -c docker-compose.yaml $DOCKER_SWARM_STACK_NAME --with-registry-auth --detach=false
#sudo docker stack remove artha_medica
