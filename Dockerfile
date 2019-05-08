FROM ubuntu:19.04
RUN mkdir -p ~/.ssh/ && echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
ADD . /source
WORKDIR /source
RUN apt update && apt upgrade && apt install --assume-yes git bash openssh-server clang build-essential vim curl
RUN ./scripts/docker_setup
WORKDIR /source/ExpoSE
