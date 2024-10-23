cd ..
call ng build
cd .docker

call C:\Docker\s8\s8-docker.cmd

docker build .. --file ../.docker/Dockerfile -t dkr.sgx.bz/fitness-ui
docker push dkr.sgx.bz/fitness-ui
docker-compose -f fitness-ui.yml -p fitness up -d

PAUSE
