ARG ALPINE_VERSION=3.12
FROM alpine:${ALPINE_VERSION}

ARG ALPINE_VERSION=3.12
ARG USERNAME=non-root
ARG UID=1000
ARG GID=1000

COPY scripts/* /tmp/scripts/
RUN apk --update-cache upgrade \
    && cd /tmp/scripts \
    && sh alpine-foundation-installer.sh "${ALPINE_VERSION}" --username "${USERNAME}" --uid "${UID}" --gid "${GID}" \
    && bash alpine-dind-foundation-installer.sh "${ALPINE_VERSION}" --username "${USERNAME}" --docker-compose \
    && cd / \
    && rm -rf /tmp/scripts

ENTRYPOINT ["entrypoint.sh"]
