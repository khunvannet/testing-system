cd ..
call ng build
cd .docker

call C:\Docker\s8\s8-docker.cmd

docker pull dkr.sgx.bz/uat-ui

docker-compose -f uat-ui.yml -p uat up -d

PAUSE
