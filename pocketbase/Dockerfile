FROM alpine:latest

ARG PB_VERSION=0.22.4 # Adjust to the latest version if needed

RUN apk add --no-cache \
    unzip \
    ca-certificates

# Download and install PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/
RUN rm /tmp/pb.zip

# Create directories for data and migrations
RUN mkdir -p /pb/pb_data /pb/pb_migrations

COPY ./pb_migrations /pb/pb_migrations
COPY ./pb_public /pb/pb_public
COPY ./entrypoint.sh /pb/entrypoint.sh
RUN chmod +x /pb/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/pb/entrypoint.sh"]
