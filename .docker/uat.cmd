cd ..
call ng build
cd .docker

call C:\Docker\s8\s8-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/uat-ui
docker push dkr.sgx.bz/uat-ui
docker-compose -f uat-ui.yml -p uat up -d

PAUSE
