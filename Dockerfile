FROM ubuntu:19.04

RUN echo "Installing dependencies"
RUN apt update && apt upgrade && apt install --assume-yes git bash openssh-server clang build-essential vim curl
RUN echo "Configuring SSH"
RUN useradd --create-home --shell /bin/bash expose
RUN echo 'expose:expose' | chpasswd
RUN mkdir -p /run/sshd
RUN mkdir -p ~/.ssh/ && echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
RUN ssh-keygen -A

RUN echo "Installing ExpoSE"
ADD . /source
RUN chown -R expose /source; chmod -R 777 /source/
USER expose
WORKDIR /source
RUN ./scripts/docker_setup


USER root

#Setup Volumes
RUN mkdir -p /work
RUN chown -R expose /work
VOLUME ["/work"]

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
