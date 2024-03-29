# Build Geth in a stock Go builder container
FROM golang:1.12-alpine as builder

RUN apk add --no-cache make gcc musl-dev linux-headers g++ llvm bash cmake git gmp-dev openssl-dev

RUN git clone https://github.com/dfinity/bn.git
RUN cd bn && make && make install

# ADD . /PlatON-Go
WORKDIR /root/
RUN git clone https://github.com/PlatONnetwork/PlatON-Go.git --recursive
COPY entrypoint.sh /root/PlatON-Go/
RUN cd PlatON-Go && ls -ltr && \
    git checkout -b evm origin/feature/evm && \
    make clean && make platon

# Pull Geth into a second stage deploy alpine container
FROM alpine:latest

RUN apk add --no-cache ca-certificates libstdc++ bash tzdata gmp-dev
COPY --from=builder /root/PlatON-Go/build/bin/platon /usr/local/bin/
COPY --from=builder /root/PlatON-Go/entrypoint.sh /usr/local/bin/
COPY --from=builder /usr/local/lib/libbls384.so /usr/local/lib/
COPY --from=builder /usr/local/lib/libmcl.so /usr/local/lib/
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ENV ENABLE_DEBUG=true
ENV ENABLE_PPROF=true
ENV ENABLE_WS=false
ENV WSAPI=platon,debug,personal,admin,net,web3,txpool
ENV ENABLE_RPC=false
ENV RPCAPI=platon,debug,personal,admin,net,web3,txpool
ENV BOOTNODES=
ENV NEW_ACCOUNT=false
ENV INIT=true
ENV VERBOSITY=3
ENV ENBALE_DISCOVER=false
ENV ENABLE_V5DISC=false
ENV ENABLE_CBFT_TRACING=true
ENV P2PPORT=16789
ENV WSPORT=6080
ENV RPCPORT=6789
ENV PPROFPORT=6060
ENV MAXPEERS=25
ENV MAXCONSENSUSPEERS=75
ENV ENABLE_LIGHT_SRV=false
ENV SYNCMODE=full

VOLUME /data/platon
EXPOSE 6060 6080 6789 16789 16789/udp
CMD ["entrypoint.sh"]
